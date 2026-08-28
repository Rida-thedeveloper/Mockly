"""
tune_random_forest.py
---------------------
Day 6 Step 3: Random Forest Hyperparameter Tuning.

Tunes RandomForestClassifier parameters using 5-fold cross-validation on the 80% training set ONLY:
  - n_estimators: [100, 200, 300]
  - max_depth: [None, 10, 20]
  - min_samples_split: [2, 5, 10]
  - min_samples_leaf: [1, 2, 4]
  - class_weight: [None, "balanced", "balanced_subsample"]

Optimizes scoring="f1_macro".
Evaluates the best model ONCE on the untouched 20% test set.
Saves tuning results to dataset/rf_hyperparameter_tuning.md.
"""

import sys
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)

# ── Paths & Constants ─────────────────────────────────────────────────────────

ROOT_DIR = Path(__file__).parent.parent.parent
DATASET_CSV = ROOT_DIR / "dataset" / "mockly_training.csv"
OUTPUT_MD = ROOT_DIR / "dataset" / "rf_hyperparameter_tuning.md"

FEATURES = ["wpm", "pause_count", "speech_duration", "word_count"]
TARGET = "hesitation_label"
CLASSES = ["Low", "Medium", "High"]


def main():
    print("==================================================")
    print("MOCKLY — DAY 6 STEP 3: HYPERPARAMETER TUNING")
    print("==================================================")

    # 1. Load dataset
    if not DATASET_CSV.exists():
        print(f"[ERROR] Dataset not found at {DATASET_CSV}")
        sys.exit(1)

    df = pd.read_csv(DATASET_CSV)

    # Clean target & features
    valid_mask = df[TARGET].astype(str).str.strip().isin(CLASSES)
    df = df[valid_mask].copy()
    df[TARGET] = df[TARGET].astype(str).str.strip()

    missing_mask = df[FEATURES].isnull().any(axis=1)
    df = df[~missing_mask].copy()

    # 2. Train/Test split (80/20 stratified, random_state=42)
    X = df[FEATURES].astype(float)
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    print(f"Training set size (for 5-fold CV): {len(X_train)} (80%)")
    print(f"Test set size (untouched)      : {len(X_test)} (20%)")

    # 3. Define Parameter Grid
    param_grid = {
        "n_estimators": [100, 200, 300],
        "max_depth": [None, 10, 20],
        "min_samples_split": [2, 5, 10],
        "min_samples_leaf": [1, 2, 4],
        "class_weight": [None, "balanced", "balanced_subsample"],
    }

    print("\n--- Parameter Grid Search ---")
    print(f"Grid options: {param_grid}")
    print("Running GridSearchCV with cv=5, scoring='f1_macro' on X_train...")

    rf_base = RandomForestClassifier(random_state=42)

    grid_search = GridSearchCV(
        estimator=rf_base,
        param_grid=param_grid,
        scoring="f1_macro",
        cv=5,
        n_jobs=-1,
        verbose=1,
    )

    grid_search.fit(X_train, y_train)

    best_params = grid_search.best_params_
    best_cv_macro_f1 = grid_search.best_score_

    print("\n--------------------------------------------------")
    print("GRID SEARCH COMPLETE")
    print("--------------------------------------------------")
    print(f"Best Random Forest parameters : {best_params}")
    print(f"Best CV Macro F1 score        : {best_cv_macro_f1:.4f}")

    # 4. Evaluate Best Model on Untouched Test Set
    best_rf = grid_search.best_estimator_
    y_pred = best_rf.predict(X_test)

    # Calculate final test set metrics
    acc = accuracy_score(y_test, y_pred)

    prec_w = precision_score(y_test, y_pred, average="weighted", labels=CLASSES, zero_division=0)
    rec_w = recall_score(y_test, y_pred, average="weighted", labels=CLASSES, zero_division=0)
    f1_w = f1_score(y_test, y_pred, average="weighted", labels=CLASSES, zero_division=0)

    prec_m = precision_score(y_test, y_pred, average="macro", labels=CLASSES, zero_division=0)
    rec_m = recall_score(y_test, y_pred, average="macro", labels=CLASSES, zero_division=0)
    f1_m = f1_score(y_test, y_pred, average="macro", labels=CLASSES, zero_division=0)

    prec_per = precision_score(y_test, y_pred, average=None, labels=CLASSES, zero_division=0)
    rec_per = recall_score(y_test, y_pred, average=None, labels=CLASSES, zero_division=0)
    f1_per = f1_score(y_test, y_pred, average=None, labels=CLASSES, zero_division=0)

    cm = confusion_matrix(y_test, y_pred, labels=CLASSES)

    per_class_dict = {}
    for idx, cls in enumerate(CLASSES):
        per_class_dict[cls] = {
            "precision": prec_per[idx],
            "recall": rec_per[idx],
            "f1": f1_per[idx],
        }

    print("\n==================================================")
    print("FINAL TEST SET EVALUATION (Tuned RF)")
    print("==================================================")
    print(f"Accuracy         : {acc:.4f} ({acc*100:.2f}%)")
    print(f"Weighted F1      : {f1_w:.4f}")
    print(f"Macro F1         : {f1_m:.4f}")
    print(f"Low-class Recall : {per_class_dict['Low']['recall']:.4f}")
    print("\nPer-class Metrics:")
    for cls in CLASSES:
        pc = per_class_dict[cls]
        print(f"  {cls:<8s} -> Prec: {pc['precision']:.4f}, Rec: {pc['recall']:.4f}, F1: {pc['f1']:.4f}")

    print("\nConfusion Matrix (Low, Medium, High):")
    print(cm)

    # 5. Baseline and Step 2 Reference Values
    models_comparison = [
        {"name": "Baseline RF", "acc": 0.4690, "f1_w": 0.4589, "f1_m": 0.3189, "low_rec": 0.0000},
        {"name": "Step 2 Exp A (balanced)", "acc": 0.4690, "f1_w": 0.4589, "f1_m": 0.3189, "low_rec": 0.0000},
        {"name": "Step 2 Exp B (balanced_subsample)", "acc": 0.4760, "f1_w": 0.4660, "f1_m": 0.3239, "low_rec": 0.0000},
        {"name": "Step 2 Exp C (None)", "acc": 0.4810, "f1_w": 0.4711, "f1_m": 0.3274, "low_rec": 0.0000},
        {"name": "Tuned RF", "acc": acc, "f1_w": f1_w, "f1_m": f1_m, "low_rec": per_class_dict["Low"]["recall"]},
    ]

    print("\n==================================================")
    print("MODEL COMPARISON TABLE")
    print("==================================================")
    header = f"{'Model':<35s} | {'Accuracy':<8s} | {'Weighted F1':<11s} | {'Macro F1':<8s} | {'Low Recall':<10s}"
    print(header)
    print("-" * len(header))
    for m in models_comparison:
        print(
            f"{m['name']:<35s} | {m['acc']:<8.4f} | {m['f1_w']:<11.4f} | {m['f1_m']:<8.4f} | {m['low_rec']:<10.4f}"
        )

    # Improvements relative to Baseline RF
    base = models_comparison[0]
    macro_imp = f1_m - base["f1_m"]
    weighted_imp = f1_w - base["f1_w"]
    acc_imp = acc - base["acc"]
    low_rec_imp = per_class_dict["Low"]["recall"] - base["low_rec"]

    print("\n--------------------------------------------------")
    print("IMPROVEMENTS (Baseline RF -> Tuned RF)")
    print("--------------------------------------------------")
    print(f"Macro F1 Improvement    : {macro_imp:+.4f}")
    print(f"Weighted F1 Improvement : {weighted_imp:+.4f}")
    print(f"Accuracy Improvement    : {acc_imp:+.4f}")
    print(f"Low Recall Improvement  : {low_rec_imp:+.4f}")

    # 6. Save Markdown Report
    md_lines = [
        "# Day 6 Step 3: Random Forest Hyperparameter Tuning Report",
        "",
        "## Overview",
        "This report details the 5-fold cross-validation hyperparameter tuning of the `RandomForestClassifier` on the 80% training set, followed by a single evaluation on the untouched 20% test set.",
        "",
        "### Features Used (4 live-compatible features):",
        "- `wpm`",
        "- `pause_count`",
        "- `speech_duration`",
        "- `word_count`",
        "",
        "### Target:",
        "- `hesitation_label` (Low, Medium, High)",
        "",
        "---",
        "",
        "## Hyperparameter Grid Search Results",
        "- **Scoring Metric:** `f1_macro`",
        "- **Cross-Validation:** 5-Fold Stratified CV (Training set only)",
        f"- **Best Cross-Validation Macro F1:** **{best_cv_macro_f1:.4f}**",
        "",
        "### Best Parameters Found:",
        "```python",
        f"{best_params}",
        "```",
        "",
        "---",
        "",
        "## Final Test Set Performance (Tuned RF)",
        f"- **Accuracy:** {acc:.4f} ({acc*100:.2f}%)",
        f"- **Weighted Precision:** {prec_w:.4f}",
        f"- **Weighted Recall:** {rec_w:.4f}",
        f"- **Weighted F1:** {f1_w:.4f}",
        f"- **Macro Precision:** {prec_m:.4f}",
        f"- **Macro Recall:** {rec_m:.4f}",
        f"- **Macro F1:** {f1_m:.4f}",
        "",
        "### Per-Class Performance:",
        "| Class | Precision | Recall | F1-Score |",
        "|---|---|---|---|",
    ]
    for cls in CLASSES:
        pc = per_class_dict[cls]
        md_lines.append(
            f"| **{cls}** | {pc['precision']:.4f} | {pc['recall']:.4f} | {pc['f1']:.4f} |"
        )

    md_lines.extend(
        [
            "",
            "### Confusion Matrix (Rows=Actual, Cols=Predicted):",
            "```text",
            f"           {'Low':>8s}  {'Medium':>8s}  {'High':>8s}",
            f" Low       {cm[0,0]:>8d}  {cm[0,1]:>8d}  {cm[0,2]:>8d}",
            f" Medium    {cm[1,0]:>8d}  {cm[1,1]:>8d}  {cm[1,2]:>8d}",
            f" High      {cm[2,0]:>8d}  {cm[2,1]:>8d}  {cm[2,2]:>8d}",
            "```",
            "",
            "---",
            "",
            "## Model Comparison Table",
            "",
            "| Model | Accuracy | Weighted F1 | Macro F1 | Low Recall |",
            "|---|---|---|---|---|",
        ]
    )

    for m in models_comparison:
        md_lines.append(
            f"| **{m['name']}** | {m['acc']:.4f} | {m['f1_w']:.4f} | **{m['f1_m']:.4f}** | **{m['low_rec']:.4f}** |"
        )

    md_lines.extend(
        [
            "",
            "---",
            "",
            "## Empirical Improvement Analysis (Baseline RF → Tuned RF)",
            "",
            f"- **Macro F1 Improvement:** `{macro_imp:+.4f}`",
            f"- **Weighted F1 Improvement:** `{weighted_imp:+.4f}`",
            f"- **Accuracy Improvement:** `{acc_imp:+.4f}`",
            f"- **Low-class Recall Improvement:** `{low_rec_imp:+.4f}`",
            "",
            "### Key Findings:",
        ]
    )

    if per_class_dict["Low"]["recall"] == 0.0:
        md_lines.append(
            "- ⚠️ **Low-Class Recall Status:** The Low-class recall remains **0.0000**. This demonstrates empirically that the 4 basic speech features (`wpm`, `pause_count`, `speech_duration`, `word_count`) alone are insufficient for detecting the minority `Low` class (4.1% of dataset) without additional signal or class rebalancing techniques."
        )
    else:
        md_lines.append(
            f"- ✅ **Low-Class Recall Status:** Low-class recall improved to {per_class_dict['Low']['recall']:.4f}."
        )

    OUTPUT_MD.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_MD, "w", encoding="utf-8") as f:
        f.write("\n".join(md_lines) + "\n")

    print(f"\n[OK] Tuning results saved to {OUTPUT_MD}")
    print("\nDay 6 Step 3 complete.")


if __name__ == "__main__":
    main()
