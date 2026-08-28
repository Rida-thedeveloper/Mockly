# Day 6 Complete Results & Summary (`day6_random_forest_results.md`)

## 1. Summary of Day 6 Work
During Day 6, we conducted systematic Random Forest evaluation and tuning:
- **Step 1:** Audited baseline Random Forest model (`hesitation_rf.joblib`, Accuracy 46.90%, Macro F1 0.3189, Low Recall 0.0000).
- **Step 2:** Evaluated class-weight strategies (`balanced`, `balanced_subsample`, `None`). Identified `class_weight=None` (Experiment C) as the top performer (Accuracy 48.10%, Macro F1 0.3274).
- **Step 3:** Ran 5-fold cross-validation hyperparameter grid search (1,215 fits). The resulting tuned model slightly increased Low recall (to 2.44%) but dropped overall accuracy to 45.10%, so it was rejected.
- **Step 4:** Selected, trained, evaluated, and saved `hesitation_rf_v2.joblib`.

---

## 2. Final Selected Model Artifacts
- **Saved Model:** `backend/ml/models/hesitation_rf_v2.joblib`
- **Baseline Model (Preserved):** `backend/ml/models/hesitation_rf.joblib`
- **Model Metadata:** `backend/ml/models/model_metadata.json`
- **Feature Importances:** `dataset/feature_importance_v2.csv`

---

## 3. Final Model Configuration
```python
RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    class_weight=None
)
```

---

## 4. Final Measured Metrics
- **Accuracy:** `0.4810` (48.10%)
- **Macro F1:** `0.3274`
- **Weighted F1:** `0.4711`
- **Low-class Recall:** `0.0000`
- **Medium-class Recall:** `0.5144`
- **High-class Recall:** `0.4884`

---

## 5. Feature Importance Breakdown
| Feature | Importance |
|---|---|
| `speech_duration` | 0.3337 |
| `word_count` | 0.2744 |
| `wpm` | 0.2447 |
| `pause_count` | 0.1473 |

---

## 6. Critical Limitations
The Step 2 Experiment C Random Forest was selected because it achieved the strongest overall test performance among the evaluated Random Forest configurations.

Low-class recall remains 0%, meaning the model did not correctly identify any Low-class samples in the test set.

---

## 7. Preparation for Day 7 Integration
The frontend and live microphone pipeline remain untouched.
In Day 7, `hesitation_rf_v2.joblib` will be loaded in `backend/main.py` and `/api/analyze` to provide live Random Forest hesitation predictions for real microphone recordings using:
```text
Mockly Microphone → Speech Analysis → [wpm, pause_count, speech_duration, word_count] → hesitation_rf_v2.joblib → Prediction & Probabilities
```

---
Day 6 Step 4 complete.
