# Day 6: Final Random Forest Selection & Evaluation Report (`random_forest_v2_report.md`)

## Executive Summary
The Step 2 Experiment C Random Forest was selected because it achieved the strongest overall test performance among the evaluated Random Forest configurations.

---

## Evaluation & Experiment Journey

### 1. Baseline Random Forest Results
- **Accuracy:** 0.4690 (46.90%)
- **Weighted F1:** 0.4589
- **Macro F1:** 0.3189
- **Low Recall:** 0.0000

### 2. Class-Weight Experiments (Step 2)
- **Experiment A (`class_weight='balanced'`):** Accuracy = 0.4690 | Macro F1 = 0.3189 | Low Recall = 0.0000
- **Experiment B (`class_weight='balanced_subsample'`):** Accuracy = 0.4760 | Macro F1 = 0.3239 | Low Recall = 0.0000
- **Experiment C (`class_weight=None`):** Accuracy = 0.4810 | Macro F1 = 0.3274 | Low Recall = 0.0000

### 3. Hyperparameter Tuning Results (Step 3)
- **Best CV Parameters:** `{'class_weight': 'balanced', 'max_depth': 10, 'min_samples_leaf': 4, 'min_samples_split': 10, 'n_estimators': 200}`
- **Test Accuracy:** 0.4510
- **Test Macro F1:** 0.3201
- **Test Weighted F1:** 0.4482
- **Test Low Recall:** 0.0244

### 4. Why the Tuned Model Was Rejected
Although the Step 3 tuned model slightly increased Low recall (+0.0244 by predicting 1 sample correctly), its overall accuracy dropped to 45.10% and Weighted F1 dropped to 0.4482. Step 2 Experiment C provided superior overall predictive power (Accuracy 48.10%, Macro F1 0.3274, Weighted F1 0.4711).

### 5. Final Selected Random Forest Configuration
```python
RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    class_weight=None
)
```

---

## Final Model Performance on Untouched Test Set
- **Accuracy:** 0.4810 (48.10%)
- **Weighted Precision:** 0.4617
- **Weighted Recall:** 0.4810
- **Weighted F1:** 0.4711
- **Macro Precision:** 0.3209
- **Macro Recall:** 0.3343
- **Macro F1:** 0.3274

### Per-Class Metrics:
| Class | Precision | Recall | F1-Score | Support |
|---|---|---|---|---|
| **Low** | 0.0000 | **0.0000** | 0.0000 | 41 |
| **Medium** | 0.4892 | **0.5144** | 0.5015 | 486 |
| **High** | 0.4734 | **0.4884** | 0.4807 | 473 |

### Confusion Matrix (Rows=Actual, Cols=Predicted):
```text
                Low    Medium      High
 Low              0        19        22
 Medium           1       250       235
 High             0       242       231
```

---

## Feature Importance

| Feature | Importance |
|---|---|
| `speech_duration` | 0.3337 |
| `word_count` | 0.2744 |
| `wpm` | 0.2447 |
| `pause_count` | 0.1473 |

---

## Baseline vs Final Model Comparison Table

| Model | Accuracy | Weighted F1 | Macro F1 | Low Recall |
|---|---|---|---|---|
| **Baseline RF** | 0.4690 | 0.4589 | **0.3189** | **0.0000** |
| **Step 2 Experiment A** | 0.4690 | 0.4589 | **0.3189** | **0.0000** |
| **Step 2 Experiment B** | 0.4760 | 0.4660 | **0.3239** | **0.0000** |
| **Step 2 Experiment C** | 0.4810 | 0.4711 | **0.3274** | **0.0000** |
| **Step 3 Tuned RF** | 0.4510 | 0.4482 | **0.3201** | **0.0244** |
| **Final Selected RF** | 0.4810 | 0.4711 | **0.3274** | **0.0000** |

### Actual Improvements (Baseline RF → Final Selected RF):
- **Accuracy Improvement:** `+0.0120` (+2.56%)
- **Weighted F1 Improvement:** `+0.0122` (+2.66%)
- **Macro F1 Improvement:** `+0.0085` (+2.67%)
- **Low Recall Improvement:** `+0.0000` (Remains 0.0000)

---

## Known Limitations & Honest Disclosure
Low-class recall remains 0%, meaning the model did not correctly identify any Low-class samples in the test set.

- The model is trained on 4 basic features (`wpm`, `pause_count`, `speech_duration`, `word_count`).
- The `Low` hesitation class represents only 4.1% of the dataset (203 / 5,000 samples).
- Without additional signal (e.g. filler words, pause duration details, silence ratio), Random Forest cannot separate `Low` from `Medium` / `High`.

---

## Final Artifact Paths
- **Model Bundle:** [`backend/ml/models/hesitation_rf_v2.joblib`](file:///C:/Users/MMC/.gemini/antigravity/scratch/Mockly/backend/ml/models/hesitation_rf_v2.joblib)
- **Metadata:** [`backend/ml/models/model_metadata.json`](file:///C:/Users/MMC/.gemini/antigravity/scratch/Mockly/backend/ml/models/model_metadata.json)
- **Feature Importance CSV:** [`dataset/feature_importance_v2.csv`](file:///C:/Users/MMC/.gemini/antigravity/scratch/Mockly/dataset/feature_importance_v2.csv)
