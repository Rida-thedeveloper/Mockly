# Day 6 Step 2: Controlled Random Forest Class Weight Experiments

## Overview
This experiment evaluates 3 controlled Random Forest class weight configurations on the exact same dataset and 80/20 train-test split.

### Features Used (4 live-compatible features):
- `wpm`
- `pause_count`
- `speech_duration`
- `word_count`

### Target:
- `hesitation_label` (Low, Medium, High)

---

## Dataset Statistics
- **Total Rows:** 5000
- **Training Set Size:** 4000 (80%)
- **Testing Set Size:** 1000 (20%)
- **Random State:** 42 (Stratified)

### Class Distribution:
| Class | Overall Count | Training Count | Testing Count |
|---|---|---|---|
| **Low** | 203 | 162 | 41 |
| **Medium** | 2430 | 1944 | 486 |
| **High** | 2367 | 1894 | 473 |

---

## Summary Comparison Table

| Experiment | Configuration (`class_weight`) | Accuracy | Weighted F1 | Macro F1 | Low Recall |
|---|---|---|---|---|---|
| **Experiment A** | `balanced` | 0.4690 | 0.4589 | **0.3189** | **0.0000** |
| **Experiment B** | `balanced_subsample` | 0.4760 | 0.4660 | **0.3239** | **0.0000** |
| **Experiment C** | `None` | 0.4810 | 0.4711 | **0.3274** | **0.0000** |

---

## Detailed Results per Experiment

### Experiment A (`class_weight='balanced'`)

#### Overall Metrics:
- **Accuracy:** 0.4690 (46.90%)
- **Weighted Precision:** 0.4495
- **Weighted Recall:** 0.4690
- **Weighted F1:** 0.4589
- **Macro Precision:** 0.3124
- **Macro Recall:** 0.3258
- **Macro F1:** 0.3189

#### Per-Class Performance:
| Class | Precision | Recall | F1-Score |
|---|---|---|---|
| **Low** | 0.0000 | 0.0000 | 0.0000 |
| **Medium** | 0.4789 | 0.5144 | 0.4960 |
| **High** | 0.4582 | 0.4630 | 0.4606 |

#### Confusion Matrix (Rows=Actual, Cols=Predicted):
```text
                Low    Medium      High
 Low              0        18        23
 Medium           0       250       236
 High             0       254       219
```

### Experiment B (`class_weight='balanced_subsample'`)

#### Overall Metrics:
- **Accuracy:** 0.4760 (47.60%)
- **Weighted Precision:** 0.4564
- **Weighted Recall:** 0.4760
- **Weighted F1:** 0.4660
- **Macro Precision:** 0.3172
- **Macro Recall:** 0.3308
- **Macro F1:** 0.3239

#### Per-Class Performance:
| Class | Precision | Recall | F1-Score |
|---|---|---|---|
| **Low** | 0.0000 | 0.0000 | 0.0000 |
| **Medium** | 0.4843 | 0.5082 | 0.4960 |
| **High** | 0.4673 | 0.4841 | 0.4756 |

#### Confusion Matrix (Rows=Actual, Cols=Predicted):
```text
                Low    Medium      High
 Low              0        19        22
 Medium           0       247       239
 High             0       244       229
```

### Experiment C (`class_weight='None'`)

#### Overall Metrics:
- **Accuracy:** 0.4810 (48.10%)
- **Weighted Precision:** 0.4617
- **Weighted Recall:** 0.4810
- **Weighted F1:** 0.4711
- **Macro Precision:** 0.3209
- **Macro Recall:** 0.3343
- **Macro F1:** 0.3274

#### Per-Class Performance:
| Class | Precision | Recall | F1-Score |
|---|---|---|---|
| **Low** | 0.0000 | 0.0000 | 0.0000 |
| **Medium** | 0.4892 | 0.5144 | 0.5015 |
| **High** | 0.4734 | 0.4884 | 0.4807 |

#### Confusion Matrix (Rows=Actual, Cols=Predicted):
```text
                Low    Medium      High
 Low              0        19        22
 Medium           1       250       235
 High             0       242       231
```

---

## Final Analysis & Best Configuration

1. **Primary Metric (Macro F1):** `Experiment C` achieved highest Macro F1 (0.3274).
2. **Secondary Metric (Low Recall):** `Experiment A` achieved highest Low-class Recall (0.0000).
3. **Tertiary Metric (Weighted F1):** `Experiment C` achieved highest Weighted F1 (0.4711).

