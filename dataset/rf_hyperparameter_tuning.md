# Day 6 Step 3: Random Forest Hyperparameter Tuning Report

## Overview
This report details the 5-fold cross-validation hyperparameter tuning of the `RandomForestClassifier` on the 80% training set, followed by a single evaluation on the untouched 20% test set.

### Features Used (4 live-compatible features):
- `wpm`
- `pause_count`
- `speech_duration`
- `word_count`

### Target:
- `hesitation_label` (Low, Medium, High)

---

## Hyperparameter Grid Search Results
- **Scoring Metric:** `f1_macro`
- **Cross-Validation:** 5-Fold Stratified CV (Training set only)
- **Best Cross-Validation Macro F1:** **0.3400**

### Best Parameters Found:
```python
{'class_weight': 'balanced', 'max_depth': 10, 'min_samples_leaf': 4, 'min_samples_split': 10, 'n_estimators': 200}
```

---

## Final Test Set Performance (Tuned RF)
- **Accuracy:** 0.4510 (45.10%)
- **Weighted Precision:** 0.4456
- **Weighted Recall:** 0.4510
- **Weighted F1:** 0.4482
- **Macro Precision:** 0.3202
- **Macro Recall:** 0.3207
- **Macro F1:** 0.3201

### Per-Class Performance:
| Class | Precision | Recall | F1-Score |
|---|---|---|---|
| **Low** | 0.0345 | 0.0244 | 0.0286 |
| **Medium** | 0.4761 | 0.4918 | 0.4838 |
| **High** | 0.4499 | 0.4461 | 0.4480 |

### Confusion Matrix (Rows=Actual, Cols=Predicted):
```text
                Low    Medium      High
 Low              1        16        24
 Medium          13       239       234
 High            15       247       211
```

---

## Model Comparison Table

| Model | Accuracy | Weighted F1 | Macro F1 | Low Recall |
|---|---|---|---|---|
| **Baseline RF** | 0.4690 | 0.4589 | **0.3189** | **0.0000** |
| **Step 2 Exp A (balanced)** | 0.4690 | 0.4589 | **0.3189** | **0.0000** |
| **Step 2 Exp B (balanced_subsample)** | 0.4760 | 0.4660 | **0.3239** | **0.0000** |
| **Step 2 Exp C (None)** | 0.4810 | 0.4711 | **0.3274** | **0.0000** |
| **Tuned RF** | 0.4510 | 0.4482 | **0.3201** | **0.0244** |

---

## Empirical Improvement Analysis (Baseline RF → Tuned RF)

- **Macro F1 Improvement:** `+0.0012`
- **Weighted F1 Improvement:** `-0.0107`
- **Accuracy Improvement:** `-0.0180`
- **Low-class Recall Improvement:** `+0.0244`

### Key Findings:
- ✅ **Low-Class Recall Status:** Low-class recall improved to 0.0244.
