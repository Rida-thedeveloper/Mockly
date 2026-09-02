"""
predict.py
----------
Prediction function for Mockly Random Forest hesitation classification.

Primary Model  : backend/ml/models/hesitation_rf_v2.joblib
Fallback Model : backend/ml/models/hesitation_rf.joblib

Features (Exact order required):
  - wpm
  - pause_count
  - speech_duration
  - word_count
"""

import sys
import logging
from pathlib import Path
import pandas as pd
import joblib

logger = logging.getLogger(__name__)

# ── Paths & Constants ─────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).parent
MODEL_V2_PATH = BASE_DIR / "models" / "hesitation_rf_v2.joblib"
MODEL_V1_PATH = BASE_DIR / "models" / "hesitation_rf.joblib"

REQUIRED_FEATURES = ["wpm", "pause_count", "speech_duration", "word_count"]


_model_cache = None
_model_name_cache = None

def get_model_path() -> tuple[Path, str]:
    """
    Returns (model_path, model_filename).
    Prefers hesitation_rf_v2.joblib; falls back to hesitation_rf.joblib.
    """
    if MODEL_V2_PATH.exists():
        return MODEL_V2_PATH, "hesitation_rf_v2.joblib"
    elif MODEL_V1_PATH.exists():
        return MODEL_V1_PATH, "hesitation_rf.joblib"
    else:
        raise FileNotFoundError(
            f"No Random Forest model found at {MODEL_V2_PATH} or {MODEL_V1_PATH}."
        )


def predict_hesitation(features: dict) -> dict:
    """
    Predict Predicted Communication Level for a set of speech features.

    Parameters
    ----------
    features : dict
        Must contain numeric values for:
        'wpm', 'pause_count', 'speech_duration', 'word_count'.

    Returns
    -------
    dict
        {
            "prediction": str ("Low", "Medium", or "High"),
            "probabilities": { "Low": float, "Medium": float, "High": float },
            "model": str (e.g. "hesitation_rf_v2.joblib")
        }
    """
    global _model_cache, _model_name_cache

    if _model_cache is None:
        model_path, model_name = get_model_path()
        # Load model bundle once
        bundle = joblib.load(model_path)
        _model_cache = bundle
        _model_name_cache = model_name
    
    bundle = _model_cache
    model_name = _model_name_cache

    if isinstance(bundle, dict) and "model" in bundle:
        clf = bundle["model"]
        feature_order = bundle.get("features", REQUIRED_FEATURES)
    else:
        clf = bundle
        feature_order = REQUIRED_FEATURES

    # Validate input features
    missing = [f for f in feature_order if f not in features]
    if missing:
        raise ValueError(f"Missing required input features for prediction: {missing}")

    # Build 1-row DataFrame matching exact feature order
    row_df = pd.DataFrame(
        [[float(features[f]) for f in feature_order]],
        columns=feature_order,
    )

    # Make prediction and compute class probabilities
    pred = str(clf.predict(row_df)[0])
    proba_array = clf.predict_proba(row_df)[0]

    # Map probabilities to model.classes_
    classes = getattr(clf, "classes_", ["Low", "Medium", "High"])
    proba_dict = {
        str(cls): round(float(prob), 4)
        for cls, prob in zip(classes, proba_array)
    }

    return {
        "prediction": pred,
        "probabilities": proba_dict,
        "model": model_name,
    }

if __name__ == "__main__":
    # Test script self-run
    sample_input = {
        "wpm": 126,
        "pause_count": 2,
        "speech_duration": 30.5,
        "word_count": 64,
    }
    res = predict_hesitation(sample_input)
    print("Self-test result:", res)
