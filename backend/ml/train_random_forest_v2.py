"""
train_random_forest_v2.py
-------------------------
Day 6 Step 2: Controlled Random Forest Class Weight Experiments.

Runs 3 Random Forest experiments:
  - Experiment A: class_weight="balanced"
  - Experiment B: class_weight="balanced_subsample"
  - Experiment C: class_weight=None

Evaluates using:
  - Primary Metric: Macro F1
  - Secondary Metric: Low-class Recall
  - Tertiary Metric: Weighted F1

Saves results to dataset/rf_class_weight_experiments.md.
"""

import sys
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
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
OUTPUT_MD = ROOT_DIR / "dataset" / "rf_class_weight_experiments.md"

FEATURES = ["wpm", "pause_count", "speech_duration", "word_count"]
TARGET = "hesitation_label"
CLASSES = ["Low", "Medium", "High"]


def main():
    print("==================================================")
    print("MOCKLY — DAY 6 STEP 2: RANDOM FOREST EXPERIMENTS")
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

    # 2. Print initial statistics
    print("\n--- Dataset Statistics ---")
    print(f"Dataset shape: {df.shape}")
    print("Overall Class distribution:")
    class_dist = df[TARGET].value_counts().reindex(CLASSES, fill_value=0)
    for cls, cnt in class_dist.items():
        pct = (cnt / len(df)) * 100
        print(f"  {cls:<8s}: {cnt:>5d} ({pct:.1f}%)")

    # 3. Train/Test split
    X = df[FEATURES].astype(float)
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y,
    )

    print(f"\nTraining set size: {len(X_train)} (80%)")
    print(f"Test set size    : {len(X_test)} (20%)")

    print("\nTraining class distribution:")
    tr_dist = y_train.value_counts().reindex(CLASSES, fill_value=0)
    for cls, cnt in tr_dist.items():
        print(f"  {cls:<8s}: {cnt:>5d}")

    print("\nTest class distribution:")
    te_dist = y_test.value_counts().reindex(CLASSES, fill_value=0)
    for cls, cnt in te_dist.items():
        print(f"  {cls:<8s}: {cnt:>5d}")

    # 4. Define Experiments
    experiments = [
        (
            "Experiment A",
            "balanced",
            RandomForestClassifier(
                n_estimators=100, random_state=42, class_weight="balanced"
            ),
        ),
        (
            "Experiment B",
            "balanced_subsample",
            RandomForestClassifier(
                n_estimators=100, random_state=42, class_weight="balanced_subsample"
            ),
        ),
        (
            "Experiment C",
            "None",
            RandomForestClassifier(
                n_estimators=100, random_state=42, class_weight=None
            ),
        ),
    ]

    results = []

    print("\n==================================================")
    print("RUNNING RANDOM FOREST EXPERIMENTS")
    print("==================================================")

    for exp_name, cw_setting, clf in experiments:
        print(f"\n--- Running {exp_name} (class_weight={cw_setting}) ---")
        clf.fit(X_train, y_train)
        y_pred = clf.predict(X_test)

        # Calculate metrics
        acc = accuracy_score(y_test, y_pred)

        # Weighted metrics
        prec_w = precision_score(y_test, y_pred, average="weighted", labels=CLASSES, zero_division=0)
        rec_w = recall_score(y_test, y_pred, average="weighted", labels=CLASSES, zero_division=0)
        f1_w = f1_score(y_test, y_pred, average="weighted", labels=CLASSES, zero_division=0)

        # Macro metrics
        prec_m = precision_score(y_test, y_pred, average="macro", labels=CLASSES, zero_division=0)
        rec_m = recall_score(y_test, y_pred, average="macro", labels=CLASSES, zero_division=0)
        f1_m = f1_score(y_test, y_pred, average="macro", labels=CLASSES, zero_division=0)

        # Per-class metrics
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

        res = {
            "exp_name": exp_name,
            "class_weight": cw_setting,
            "accuracy": acc,
            "weighted_precision": prec_w,
            "weighted_recall": rec_w,
            "weighted_f1": f1_w,
            "macro_precision": prec_m,
            "macro_recall": rec_m,
            "macro_f1": f1_m,
            "per_class": per_class_dict,
            "confusion_matrix": cm,
            "low_recall": per_class_dict["Low"]["recall"],
        }
        results.append(res)

        print(f"Accuracy         : {acc:.4f} ({acc*100:.2f}%)")
        print(f"Weighted F1      : {f1_w:.4f}")
        print(f"Macro F1         : {f1_m:.4f}")
        print(f"Low-class Recall : {res['low_recall']:.4f}")
        print("Confusion Matrix (Low, Medium, High):")
        print(cm)

    # 5. Print Comparison Table
    print("\n==================================================")
    print("EXPERIMENT COMPARISON TABLE")
    print("==================================================")
    header = f"{'Experiment':<15s} | {'Accuracy':<8s} | {'Weighted F1':<11s} | {'Macro F1':<8s} | {'Low Recall':<10s}"
    print(header)
    print("-" * len(header))
    for r in results:
        print(
            f"{r['exp_name']:<15s} | {r['accuracy']:<8.4f} | {r['weighted_f1']:<11.4f} | {r['macro_f1']:<8.4f} | {r['low_recall']:<10.4f}"
        )

    # Determine best experiment
    best_macro_f1 = max(results, key=lambda x: x["macro_f1"])
    best_low_recall = max(results, key=lambda x: x["low_recall"])
    best_weighted_f1 = max(results, key=lambda x: x["weighted_f1"])

    print("\n--------------------------------------------------")
    print("BEST CONFIGURATION SELECTION")
    print("--------------------------------------------------")
    print(f"1. Best according to Macro F1 (Primary Metric)   : {best_macro_f1['exp_name']} (Macro F1 = {best_macro_f1['macro_f1']:.4f})")
    print(f"2. Best according to Low Recall (Secondary)       : {best_low_recall['exp_name']} (Low Recall = {best_low_recall['low_recall']:.4f})")
    print(f"3. Best according to Weighted F1 (Tertiary)      : {best_weighted_f1['exp_name']} (Weighted F1 = {best_weighted_f1['weighted_f1']:.4f})")

    # 6. Save Markdown Report
    md_lines = [
        "# Day 6 Step 2: Controlled Random Forest Class Weight Experiments",
        "",
        "## Overview",
        "This experiment evaluates 3 controlled Random Forest class weight configurations on the exact same dataset and 80/20 train-test split.",
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
        "## Dataset Statistics",
        f"- **Total Rows:** {len(df)}",
        f"- **Training Set Size:** {len(X_train)} (80%)",
        f"- **Testing Set Size:** {len(X_test)} (20%)",
        "- **Random State:** 42 (Stratified)",
        "",
        "### Class Distribution:",
        "| Class | Overall Count | Training Count | Testing Count |",
        "|---|---|---|---|",
    ]
    for cls in CLASSES:
        md_lines.append(
            f"| **{cls}** | {class_dist[cls]} | {tr_dist[cls]} | {te_dist[cls]} |"
        )

    md_lines.extend(
        [
            "",
            "---",
            "",
            "## Summary Comparison Table",
            "",
            "| Experiment | Configuration (`class_weight`) | Accuracy | Weighted F1 | Macro F1 | Low Recall |",
            "|---|---|---|---|---|---|",
        ]
    )

    for r in results:
        md_lines.append(
            f"| **{r['exp_name']}** | `{r['class_weight']}` | {r['accuracy']:.4f} | {r['weighted_f1']:.4f} | **{r['macro_f1']:.4f}** | **{r['low_recall']:.4f}** |"
        )

    md_lines.extend(
        [
            "",
            "---",
            "",
            "## Detailed Results per Experiment",
            "",
        ]
    )

    for r in results:
        cm = r["confusion_matrix"]
        md_lines.extend(
            [
                f"### {r['exp_name']} (`class_weight='{r['class_weight']}'`)",
                "",
                "#### Overall Metrics:",
                f"- **Accuracy:** {r['accuracy']:.4f} ({r['accuracy']*100:.2f}%)",
                f"- **Weighted Precision:** {r['weighted_precision']:.4f}",
                f"- **Weighted Recall:** {r['weighted_recall']:.4f}",
                f"- **Weighted F1:** {r['weighted_f1']:.4f}",
                f"- **Macro Precision:** {r['macro_precision']:.4f}",
                f"- **Macro Recall:** {r['macro_recall']:.4f}",
                f"- **Macro F1:** {r['macro_f1']:.4f}",
                "",
                "#### Per-Class Performance:",
                "| Class | Precision | Recall | F1-Score |",
                "|---|---|---|---|",
            ]
        )
        for cls in CLASSES:
            pc = r["per_class"][cls]
            md_lines.append(
                f"| **{cls}** | {pc['precision']:.4f} | {pc['recall']:.4f} | {pc['f1']:.4f} |"
            )

        md_lines.extend(
            [
                "",
                "#### Confusion Matrix (Rows=Actual, Cols=Predicted):",
                "```text",
                f"           {'Low':>8s}  {'Medium':>8s}  {'High':>8s}",
                f" Low       {cm[0,0]:>8d}  {cm[0,1]:>8d}  {cm[0,2]:>8d}",
                f" Medium    {cm[1,0]:>8d}  {cm[1,1]:>8d}  {cm[1,2]:>8d}",
                f" High      {cm[2,0]:>8d}  {cm[2,1]:>8d}  {cm[2,2]:>8d}",
                "```",
                "",
            ]
        )

    md_lines.extend(
        [
            "---",
            "",
            "## Final Analysis & Best Configuration",
            "",
            f"1. **Primary Metric (Macro F1):** `{best_macro_f1['exp_name']}` achieved highest Macro F1 ({best_macro_f1['macro_f1']:.4f}).",
            f"2. **Secondary Metric (Low Recall):** `{best_low_recall['exp_name']}` achieved highest Low-class Recall ({best_low_recall['low_recall']:.4f}).",
            f"3. **Tertiary Metric (Weighted F1):** `{best_weighted_f1['exp_name']}` achieved highest Weighted F1 ({best_weighted_f1['weighted_f1']:.4f}).",
            "",
        ]
    )

    OUTPUT_MD.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_MD, "w", encoding="utf-8") as f:
        f.write("\n".join(md_lines) + "\n")

    print(f"\n[OK] Experiment results saved to {OUTPUT_MD}")
    print("\nDay 6 Step 2 complete.")


if __name__ == "__main__":
    main()
