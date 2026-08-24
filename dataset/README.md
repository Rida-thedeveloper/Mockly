# Mockly Dataset — README

## Purpose

This dataset is used to train a **Random Forest** classifier that predicts
interview hesitation level from extracted speech features.  
Features are computed by Mockly's `/api/analyze` endpoint (Whisper + librosa).

---

## CSV Columns

| Column | Type | Description |
|---|---|---|
| `audio_id` | string | Unique ID for the recording (e.g. `rec_001`) |
| `question_id` | string | Interview question identifier (e.g. `q_01`) |
| `wpm` | int | Words per minute (speaking rate) |
| `pause_count` | int | Number of detected pauses |
| `average_pause` | float | Mean pause duration in seconds |
| `silence_ratio` | float | Fraction of audio that is silence (0–1) |
| `long_pause_count` | int | Pauses longer than threshold (e.g. > 1.5 s) |
| `filler_count` | int | Count of filler words (um, uh, like, you know…) |
| `repetition_count` | int | Count of repeated words/phrases |
| `hesitation_label` | string | **Human-assigned** label: `Low`, `Medium`, or `High` |

---

## Hesitation Labels

> These are **communication-behaviour labels** describing how fluent the
> speaker sounds in an interview context.  
> They are **NOT** psychological or medical diagnoses.

### 🟢 Low
Relatively fluent speech.  
- Few or no filler words  
- Few and/or short pauses  
- Few word repetitions  
- Speech flow feels natural and confident

### 🟡 Medium
Noticeable but not dominant disfluency.  
- Some filler words present  
- Occasional pauses or brief hesitations  
- Some word repetitions  
- Speech flow is slightly disrupted but still easy to follow

### 🔴 High
Frequent and/or long disfluency.  
- Frequent filler words  
- Frequent and/or long pauses  
- Repeated words or phrases throughout  
- Speech flow is noticeably disrupted

---

## Labelling Workflow

1. Record an answer with Mockly → features are extracted automatically.  
2. `export_to_csv.py` appends a row with `hesitation_label` **blank**.  
3. A human annotator opens `annotation_template.csv`, listens to the
   recording, and fills in `Low`, `Medium`, or `High`.  
4. The annotated row is copied into `mockly_training.csv`.  
5. Run `validate_dataset.py` to check the CSV before training.

---

## Files

| File | Purpose |
|---|---|
| `mockly_training.csv` | Master labelled training data |
| `annotation_template.csv` | Blank template for human annotators |
| `validate_dataset.py` | Data-quality checks |
| `public_data_notes.md` | Notes on using public speech datasets |

---

## Minimum Recommended Data

| Label | Minimum rows |
|---|---|
| Low | 30 |
| Medium | 30 |
| High | 30 |

Aim for **balanced classes** before training.
