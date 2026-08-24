# Feature Mapping & Compatibility Analysis

This document details the alignment between the **public training dataset** (`audio_speaking_dataset.csv`) and the **Mockly live audio analysis pipeline** (`/api/analyze`). 

Ensure exactly identical feature semantics are used during model training ($X$) and live inference.

---

## 1. Feature Map (Used in Training)

These features are calculated during Mockly analysis from a live user microphone recording, and are also present in the training dataset.

| Public Dataset Feature | Mockly Live Feature | Type | Details |
|---|---|---|---|
| `speaking_rate_wpm` | `wpm` | Integer | Speaking rate in words per minute. (Mapped by rounding `speaking_rate_wpm` to nearest integer). |
| `pause_count` | `pause_count` | Integer | Count of silent segments (> 0.3s) in the audio. |
| `speech_duration_sec` | `speech_duration` | Float | The total speech duration (excluding silent pauses), rounded to 3 decimal places. |
| `word_count` | `word_count` | Integer | Total count of word tokens transcribed by OpenAI Whisper. |

---

## 2. Metadata Columns (Stored but Excluded from Model Features)

These fields are retained inside the CSV files for debugging, audit, and indexing, but **must be excluded** from the input matrix $X$ during ML training.

* **`audio_id`** (Mapped from public `sample_id`): Unique ID to prevent duplicated training records.
* **`question_id`** (Mapped from public `task_type`): Context of the prompt.
* **`speaker_id`** (From public `speaker_id`): Demographics identifier of the original dataset speaker.
* **`task_type`** (From public `task_type`): Retained directly as metadata.

---

## 3. Rejected Dataset Columns (Risk of Data Leakage & Non-Parity)

These columns are present in the public dataset but **fully excluded** from training to avoid target leakage or because they cannot be calculated in live analysis.

| Column | Reason for Rejection |
|---|---|
| `target_level` | **Target Leakage**: This is the label the model aims to predict. |
| `overall_score` | **Target Leakage / Subjective**: Represents human clinical or teacher holistic grading, heavily correlated with `target_level`. |
| `pronunciation_score` | **Out of Scope**: Not evaluated by the current Mockly audio pipeline. |
| `intonation_score` | **Out of Scope**: Not evaluated by the current Mockly audio pipeline. |
| `fluency_score` | **Subjective/Redundant**: Directly correlates with the target. Mockly computes objective indicators (`pause_count`, `wpm`) rather than subjective scores. |
| `age`, `gender`, `region`, `education_level`, `english_learning_years` | **Demographic Bias / Non-Parity**: Live mock interviews should not require profile demographics to evaluate speech traits. |

---

## 4. Hesitation Label Interpretations

The dataset's `target_level` maps to `hesitation_label`. 

> [!IMPORTANT]
> The target classes (`Low`, `Medium`, `High`) represent **dataset-defined communication behavior levels** from simulated English test responses.
> They are **NOT** clinical diagnoses, medical instruments, or scientifically established hesitation measurements.
