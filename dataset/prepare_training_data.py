"""
prepare_training_data.py
------------------------
Cleans and transforms dataset/audio_speaking_dataset.csv
into dataset/mockly_training.csv.

Performs:
  - Validation of raw columns
  - In-place de-duplication
  - Missing value removal
  - Class validation (Low, Medium, High only)
  - Column mapping to Mockly schema

Usage:
    python dataset/prepare_training_data.py
"""

import sys
from pathlib import Path

try:
    import pandas as pd
except ImportError:
    print("[ERROR] pandas is required. Run: pip install pandas")
    sys.exit(1)

# ── Paths ──────────────────────────────────────────────────────────────────────

ROOT_DIR = Path(__file__).parent.parent
RAW_CSV_PATH = ROOT_DIR / "dataset" / "audio_speaking_dataset.csv"
CLEAN_CSV_PATH = ROOT_DIR / "dataset" / "mockly_training.csv"

# ── Schema Configuration ───────────────────────────────────────────────────────

REQUIRED_RAW_COLS = [
    "sample_id",
    "task_type",
    "speaking_rate_wpm",
    "pause_count",
    "speech_duration_sec",
    "word_count",
    "target_level",
]

TARGET_COLUMNS = [
    "audio_id",
    "question_id",
    "wpm",
    "pause_count",
    "speech_duration",
    "word_count",
    "average_pause",
    "silence_ratio",
    "long_pause_count",
    "filler_count",
    "repetition_count",
    "hesitation_label",
]

ALLOWED_LABELS = {"Low", "Medium", "High"}

# ── Execution ──────────────────────────────────────────────────────────────────

def main() -> None:
    print("\n--- Running prepare_training_data.py ---")

    if not RAW_CSV_PATH.exists():
        print(f"[ERROR] Raw dataset not found at {RAW_CSV_PATH}")
        sys.exit(1)

    print(f"Loading raw dataset from {RAW_CSV_PATH}...")
    df = pd.read_csv(RAW_CSV_PATH)
    initial_rows = len(df)
    print(f"Loaded {initial_rows} rows.")

    # 1. Validate raw columns
    missing_raw = [col for col in REQUIRED_RAW_COLS if col not in df.columns]
    if missing_raw:
        print(f"[ERROR] Missing required columns in raw dataset: {missing_raw}")
        sys.exit(1)
    print("[OK] All required raw columns are present.")

    # 2. De-duplicate based on sample_id (audio_id)
    duplicates_count = df.duplicated(subset=["sample_id"]).sum()
    if duplicates_count > 0:
        print(f"Found {duplicates_count} duplicate sample_id values. Removing them...")
        df = df.drop_duplicates(subset=["sample_id"], keep="first")
    print(f"[OK] De-duplication complete. Row count: {len(df)}")

    # 3. Handle missing values in necessary columns
    null_counts = df[REQUIRED_RAW_COLS].isnull().sum()
    total_nulls = null_counts.sum()
    if total_nulls > 0:
        print(f"[WARN] Found missing values in required columns:\n{null_counts[null_counts > 0]}")
        print("Dropping rows with missing values...")
        df = df.dropna(subset=REQUIRED_RAW_COLS)
        print(f"Rows remaining after missing value removal: {len(df)}")
    else:
        print("[OK] No missing values detected in required columns.")

    # 4. Validate target labels (Low, Medium, High)
    invalid_labels_mask = ~df["target_level"].astype(str).str.strip().isin(ALLOWED_LABELS)
    invalid_label_count = invalid_labels_mask.sum()
    if invalid_label_count > 0:
        invalid_vals = df.loc[invalid_labels_mask, "target_level"].unique()
        print(f"[WARN] Found {invalid_label_count} rows with invalid target labels: {invalid_vals}")
        print("Filtering rows to keep only valid target levels (Low, Medium, High)...")
        df = df[~invalid_labels_mask]
        print(f"Rows remaining: {len(df)}")
    else:
        print("[OK] All target labels are valid.")

    # 5. Map columns & construct final DataFrame
    clean_df = pd.DataFrame(index=df.index, columns=TARGET_COLUMNS)

    # Metadata & direct values
    clean_df["audio_id"] = df["sample_id"].astype(str).str.strip()
    clean_df["question_id"] = df["task_type"].astype(str).str.strip()
    clean_df["hesitation_label"] = df["target_level"].astype(str).str.strip()

    # Numeric conversions: round/cast appropriately
    clean_df["wpm"] = df["speaking_rate_wpm"].round().astype(int)
    clean_df["pause_count"] = df["pause_count"].astype(int)
    clean_df["speech_duration"] = df["speech_duration_sec"].astype(float).round(3)
    clean_df["word_count"] = df["word_count"].astype(int)

    # Unmapped features from public dataset are left empty/blank
    for extra_col in [
        "average_pause",
        "silence_ratio",
        "long_pause_count",
        "filler_count",
        "repetition_count",
    ]:
        clean_df[extra_col] = "" # left blank for parity with annotate template

    # Save to mockly_training.csv
    print(f"Saving cleaned dataset to {CLEAN_CSV_PATH}...")
    clean_df.to_csv(CLEAN_CSV_PATH, index=False)
    print(f"[OK] Saved {len(clean_df)} rows to {CLEAN_CSV_PATH}")
    print("--- Done ---")


if __name__ == "__main__":
    main()
