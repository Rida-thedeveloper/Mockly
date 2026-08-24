"""
hesitation_model.py
-------------------
Trains a Random Forest classifier to predict the Predicted Communication Level
(Low / Medium / High) from four measurable speech features extracted by Mockly.

SCIENTIFIC DISCLAIMER
---------------------
The target label comes from the public dataset's 'target_level' column, which
represents a dataset-defined communication quality rating — NOT a clinical
diagnosis, psychological assessment, or scientifically validated hesitation
measurement. The prediction returned by this model should be described as
"Predicted Communication Level" or "Speech Communication Level", not as a
medical or diagnostic result. This is a first ML prototype.

Usage:
    python backend/ml/hesitation_model.py
"""

import sys
import json
from pathlib import Path

# ── Dependency check ───────────────────────────────────────────────────────────
for pkg, import_name in [
    ("pandas", "pandas"),
    ("numpy", "numpy"),
    ("sklearn", "scikit-learn"),
    ("joblib", "joblib"),
]:
    try:
        __import__(pkg)
    except ImportError:
        print(f"[ERROR] '{import_name}' is not installed.")
        print(f"        Run: pip install {import_name}")
        sys.exit(1)

import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split

# ── Paths ──────────────────────────────────────────────────────────────────────

ROOT_DIR    = Path(__file__).parent.parent.parent
DATASET_CSV = ROOT_DIR / "dataset" / "mockly_training.csv"
MODEL_DIR   = Path(__file__).parent / "models"
MODEL_PATH  = MODEL_DIR / "hesitation_rf.joblib"
REPORT_PATH = ROOT_DIR / "dataset" / "model_report.txt"

# ── Constants ──────────────────────────────────────────────────────────────────

FEATURES = ["wpm", "pause_count", "speech_duration", "word_count"]
TARGET   = "hesitation_label"
CLASSES  = ["Low", "Medium", "High"]

MODEL_BUNDLE_KEYS = {
    "model": None,
    "features": FEATURES,
}

# ── Helpers ────────────────────────────────────────────────────────────────────

class ReportWriter:
    def __init__(self, path: Path):
        self.path = path
        self.lines: list[str] = []

    def write(self, line: str = ""):
        print(line)
        self.lines.append(line)

    def save(self):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.path, "w", encoding="utf-8") as f:
            f.write("\n".join(self.lines) + "\n")
        print(f"\n[OK] Report saved to {self.path}")


def fmt_dist(series: pd.Series) -> str:
    counts = series.value_counts().reindex(CLASSES, fill_value=0)
    return "  " + " | ".join(f"{lbl}: {cnt}" for lbl, cnt in counts.items())


# ══════════════════════════════════════════════════════════════════════════════
# STEP 1 — Load & validate dataset
# ══════════════════════════════════════════════════════════════════════════════

def load_dataset() -> pd.DataFrame:
    if not DATASET_CSV.exists():
        print(f"[ERROR] Dataset not found: {DATASET_CSV}")
        sys.exit(1)

    df = pd.read_csv(DATASET_CSV)

    # Keep only rows with valid labels
    valid_mask = df[TARGET].astype(str).str.strip().isin(CLASSES)
    invalid_count = (~valid_mask).sum()
    if invalid_count:
        print(f"[WARN] Dropping {invalid_count} rows with invalid/blank hesitation_label.")
        df = df[valid_mask].copy()

    # Drop rows with missing core features
    missing_mask = df[FEATURES].isnull().any(axis=1)
    if missing_mask.sum():
        print(f"[WARN] Dropping {missing_mask.sum()} rows with missing core features.")
        df = df[~missing_mask].copy()

    df[TARGET] = df[TARGET].astype(str).str.strip()
    return df


# ══════════════════════════════════════════════════════════════════════════════
# STEP 2 — Train / test split
# ══════════════════════════════════════════════════════════════════════════════

def split_data(df: pd.DataFrame):
    X = df[FEATURES].astype(float)
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )
    return X_train, X_test, y_train, y_test


# ══════════════════════════════════════════════════════════════════════════════
# STEP 3 — Train model
# ══════════════════════════════════════════════════════════════════════════════

def train_model(X_train, y_train) -> RandomForestClassifier:
    clf = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        class_weight="balanced",
    )
    clf.fit(X_train, y_train)
    return clf


# ══════════════════════════════════════════════════════════════════════════════
# STEP 4 — Evaluate
# ══════════════════════════════════════════════════════════════════════════════

def evaluate(clf: RandomForestClassifier, X_test, y_test, rw: ReportWriter) -> dict:
    y_pred = clf.predict(X_test)

    acc  = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average="weighted",
                           labels=CLASSES, zero_division=0)
    rec  = recall_score(y_test, y_pred, average="weighted",
                        labels=CLASSES, zero_division=0)
    f1   = f1_score(y_test, y_pred, average="weighted",
                    labels=CLASSES, zero_division=0)
    cm   = confusion_matrix(y_test, y_pred, labels=CLASSES)
    report_str = classification_report(y_test, y_pred,
                                       labels=CLASSES, zero_division=0)

    rw.write("--------------------------------------------------")
    rw.write("EVALUATION RESULTS (held-out test set)")
    rw.write("--------------------------------------------------")
    rw.write(f"  Accuracy  : {acc:.4f}  ({acc*100:.2f}%)")
    rw.write(f"  Precision : {prec:.4f}  (weighted)")
    rw.write(f"  Recall    : {rec:.4f}  (weighted)")
    rw.write(f"  F1-score  : {f1:.4f}  (weighted)")
    rw.write()
    rw.write("Classification Report:")
    for line in report_str.strip().split("\n"):
        rw.write("  " + line)
    rw.write()
    rw.write("Confusion Matrix  (rows=Actual, cols=Predicted):")
    rw.write(f"  {'':>10s}  " + "  ".join(f"{c:>8s}" for c in CLASSES))
    for i, cls in enumerate(CLASSES):
        rw.write(f"  {cls:>10s}  " + "  ".join(f"{cm[i,j]:>8d}" for j in range(len(CLASSES))))

    return {
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1": f1,
        "confusion_matrix": cm,
    }


# ══════════════════════════════════════════════════════════════════════════════
# STEP 5 — Feature importance
# ══════════════════════════════════════════════════════════════════════════════

def report_feature_importance(clf: RandomForestClassifier,
                               rw: ReportWriter) -> dict:
    importance = dict(zip(FEATURES, clf.feature_importances_))
    sorted_imp = dict(sorted(importance.items(), key=lambda x: x[1], reverse=True))

    rw.write()
    rw.write("--------------------------------------------------")
    rw.write("FEATURE IMPORTANCE")
    rw.write("--------------------------------------------------")
    rw.write(f"  {'Feature':<20s}  {'Importance':>10s}")
    rw.write(f"  {'-'*20}  {'-'*10}")
    for feat, imp in sorted_imp.items():
        bar = "#" * int(imp * 40)
        rw.write(f"  {feat:<20s}  {imp:>10.4f}  {bar}")

    return sorted_imp


# ══════════════════════════════════════════════════════════════════════════════
# STEP 6 — Save model bundle
# ══════════════════════════════════════════════════════════════════════════════

def save_model(clf: RandomForestClassifier) -> None:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    bundle = {
        "model": clf,
        "features": FEATURES,
    }
    joblib.dump(bundle, MODEL_PATH)
    print(f"\n[OK] Model bundle saved to {MODEL_PATH}")


# ══════════════════════════════════════════════════════════════════════════════
# STEP 7 — Prediction function
# ══════════════════════════════════════════════════════════════════════════════

def predict_hesitation(features: dict,
                       bundle_path: Path = MODEL_PATH) -> dict:
    """
    Predict the Predicted Communication Level for a set of live speech features.

    Parameters
    ----------
    features : dict
        Must contain exactly the keys in FEATURES:
        'wpm', 'pause_count', 'speech_duration', 'word_count'.
    bundle_path : Path
        Path to the saved joblib model bundle.

    Returns
    -------
    dict with keys:
        'prediction'    : str  ('Low', 'Medium', or 'High')
        'probabilities' : dict  {class: probability}
    """
    if not bundle_path.exists():
        raise FileNotFoundError(
            f"Model bundle not found at {bundle_path}. "
            "Run hesitation_model.py first to train and save the model."
        )

    bundle = joblib.load(bundle_path)
    clf: RandomForestClassifier = bundle["model"]
    feature_order: list[str]    = bundle["features"]

    # Build the feature vector in the exact training order as a DataFrame
    # (ensures sklearn does not emit feature-name warnings)
    row = pd.DataFrame([[float(features[f]) for f in feature_order]],
                       columns=feature_order)

    prediction   = clf.predict(row)[0]
    proba_array  = clf.predict_proba(row)[0]
    proba_dict   = {cls: round(float(p), 4)
                    for cls, p in zip(clf.classes_, proba_array)}
    return {
        "prediction":    prediction,
        "probabilities": proba_dict,
    }


# ══════════════════════════════════════════════════════════════════════════════
# STEP 8 — Smoke test
# ══════════════════════════════════════════════════════════════════════════════

def smoke_test(rw: ReportWriter) -> None:
    sample = {
        "wpm":             126,
        "pause_count":     2,
        "speech_duration": 30.5,
        "word_count":      64,
    }

    result = predict_hesitation(sample)

    rw.write()
    rw.write("--------------------------------------------------")
    rw.write("SMOKE TEST  (not a real user recording)")
    rw.write("--------------------------------------------------")
    rw.write(f"  Input features : {sample}")
    rw.write(f"  Prediction     : {result['prediction']}")
    rw.write("  Probabilities  :")
    for cls, prob in result["probabilities"].items():
        rw.write(f"    {cls:<8s}: {prob:.4f}  ({prob*100:.1f}%)")
    rw.write()
    rw.write("  NOTE: This is a smoke test only. The prediction is based on")
    rw.write("  measurable speech characteristics and is NOT a clinical assessment.")


# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════

def main() -> None:
    rw = ReportWriter(REPORT_PATH)

    rw.write("==================================================")
    rw.write("MOCKLY — RANDOM FOREST MODEL REPORT")
    rw.write("==================================================")
    rw.write()
    rw.write("SCIENTIFIC DISCLAIMER")
    rw.write("-" * 50)
    rw.write("  This model predicts 'Predicted Communication Level'")
    rw.write("  (Low / Medium / High) based on measurable speech")
    rw.write("  characteristics. It is a first ML prototype trained on")
    rw.write("  a public features-based dataset. The prediction is NOT")
    rw.write("  a clinical diagnosis or scientifically validated psychological")
    rw.write("  assessment of hesitation or fluency.")
    rw.write()

    # -- Load --
    rw.write("--------------------------------------------------")
    rw.write("DATASET")
    rw.write("--------------------------------------------------")
    df = load_dataset()
    rw.write(f"  Source          : {DATASET_CSV.name}")
    rw.write(f"  Total samples   : {len(df)}")
    rw.write(f"  Features (X)    : {FEATURES}")
    rw.write(f"  Target  (y)     : {TARGET}")
    rw.write(f"  Class distribution ({TARGET}):")
    dist = df[TARGET].value_counts().reindex(CLASSES, fill_value=0)
    for label, count in dist.items():
        pct = count / len(df) * 100
        rw.write(f"    {label:<8s}: {count:>5d}  ({pct:.1f}%)")

    # -- Split --
    rw.write()
    rw.write("--------------------------------------------------")
    rw.write("TRAIN / TEST SPLIT")
    rw.write("--------------------------------------------------")
    X_train, X_test, y_train, y_test = split_data(df)
    rw.write(f"  Training samples : {len(X_train)}  (80%)")
    rw.write(f"  Testing  samples : {len(X_test)}   (20%)")
    rw.write(f"  random_state=42, stratify=y")
    rw.write()
    rw.write(f"  Training class distribution:")
    rw.write(fmt_dist(y_train))
    rw.write(f"  Testing  class distribution:")
    rw.write(fmt_dist(y_test))

    # -- Train --
    rw.write()
    rw.write("--------------------------------------------------")
    rw.write("MODEL")
    rw.write("--------------------------------------------------")
    rw.write("  Type           : RandomForestClassifier")
    rw.write("  n_estimators   : 100")
    rw.write("  random_state   : 42")
    rw.write("  class_weight   : balanced")
    rw.write()
    rw.write("  Training model...")
    clf = train_model(X_train, y_train)
    rw.write("  [OK] Training complete.")

    # -- Evaluate --
    rw.write()
    metrics = evaluate(clf, X_test, y_test, rw)

    # -- Feature importance --
    importance = report_feature_importance(clf, rw)

    # -- Save --
    save_model(clf)
    rw.write()
    rw.write("--------------------------------------------------")
    rw.write("SAVED FILES")
    rw.write("--------------------------------------------------")
    rw.write(f"  Model bundle : {MODEL_PATH}")
    rw.write(f"  Feature order: {FEATURES}")

    # -- Smoke test --
    smoke_test(rw)

    # -- Summary --
    rw.write()
    rw.write("==================================================")
    rw.write("SUMMARY")
    rw.write("==================================================")
    rw.write(f"  Training samples : {len(X_train)}")
    rw.write(f"  Testing  samples : {len(X_test)}")
    rw.write(f"  Accuracy         : {metrics['accuracy']:.4f}")
    rw.write(f"  Precision (wtd)  : {metrics['precision']:.4f}")
    rw.write(f"  Recall    (wtd)  : {metrics['recall']:.4f}")
    rw.write(f"  F1-score  (wtd)  : {metrics['f1']:.4f}")
    rw.write()
    rw.write("  LIMITATIONS")
    rw.write("  - Low class is imbalanced (203 samples vs ~2400 others).")
    rw.write("  - class_weight='balanced' is applied to compensate.")
    rw.write("  - Model trained on public features-only dataset (no raw audio).")
    rw.write("  - Optional features (average_pause, silence_ratio, etc.) not used.")
    rw.write("  - This is a prototype. Do not use for clinical assessment.")

    rw.save()


if __name__ == "__main__":
    main()
