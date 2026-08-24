"""
validate_dataset.py
-------------------
Validates mockly_training.csv before model training.

Checks:
  - Required columns present
  - No missing values in core input features (wpm, pause_count, speech_duration, word_count)
  - Optional features (average_pause, silence_ratio, etc.) logged as blank/warning
  - hesitation_label values are only: Low, Medium, High
  - Numeric columns contain valid numbers
  - Duplicate audio_id entries
  - Class distribution summary

Saves a report to dataset/validation_report.txt.
"""

import argparse
import sys
from pathlib import Path

try:
    import pandas as pd
except ImportError:
    print("[ERROR] pandas is not installed. Run: pip install pandas")
    sys.exit(1)

# ── Constants ──────────────────────────────────────────────────────────────────

REQUIRED_COLUMNS = [
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

# Core features that MUST NOT contain missing values
CORE_FEATURES = [
    "wpm",
    "pause_count",
    "speech_duration",
    "word_count",
]

# Optional features that can be blank for some source datasets
OPTIONAL_FEATURES = [
    "average_pause",
    "silence_ratio",
    "long_pause_count",
    "filler_count",
    "repetition_count",
]

NUMERIC_COLUMNS = CORE_FEATURES + OPTIONAL_FEATURES

ALLOWED_LABELS = {"Low", "Medium", "High"}

# ── Logger/Writer Helper ───────────────────────────────────────────────────────

class ReportLogger:
    def __init__(self, filepath: Path):
        self.filepath = filepath
        self.buffer = []

    def log(self, msg: str = ""):
        print(msg)
        self.buffer.append(msg)

    def write_to_file(self):
        with open(self.filepath, "w", encoding="utf-8") as f:
            f.write("\n".join(self.buffer) + "\n")


# ── Checks ─────────────────────────────────────────────────────────────────────

def check_columns(df: pd.DataFrame, logger: ReportLogger) -> bool:
    missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing:
        logger.log(f"  [ERR]  Missing columns: {missing}")
        return False
    logger.log("  [OK]   All required columns present.")
    return True


def check_missing_feature_values(df: pd.DataFrame, logger: ReportLogger) -> bool:
    # 1. Check Core features (Must be fully populated)
    core_missing = df[CORE_FEATURES].isnull().sum()
    has_core_missing = core_missing[core_missing > 0]
    core_ok = True
    if not has_core_missing.empty:
        logger.log("  [ERR]  Missing values in core feature columns:")
        for col, count in has_core_missing.items():
            logger.log(f"         {col}: {count} missing")
        core_ok = False
    else:
        logger.log("  [OK]   No missing values in core input feature columns.")

    # 2. Check Optional features (Can be empty)
    optional_missing = df[OPTIONAL_FEATURES].isnull().sum()
    blank_rows = len(df)
    has_opt_missing = optional_missing[optional_missing > 0]
    if not has_opt_missing.empty:
        logger.log("  [INFO] Missing/blank values in optional feature columns (expected for some datasets):")
        for col, count in has_opt_missing.items():
            logger.log(f"         {col}: {count} missing / blank")
    
    return core_ok


def check_numeric_columns(df: pd.DataFrame, logger: ReportLogger) -> bool:
    all_ok = True
    for col in NUMERIC_COLUMNS:
        if col not in df.columns:
            continue
        
        # We allow NaN/null on optional columns, but non-null must be numeric
        series = df[col]
        if col in OPTIONAL_FEATURES:
            series = series.dropna()
            
        non_numeric = pd.to_numeric(series, errors="coerce").isnull().sum()
        if non_numeric > 0:
            logger.log(f"  [ERR]  Column '{col}' has {non_numeric} non-numeric value(s).")
            all_ok = False
            
    if all_ok:
        logger.log("  [OK]   All numeric columns contain valid numbers.")
    return all_ok


def check_labels(df: pd.DataFrame, logger: ReportLogger) -> bool:
    if "hesitation_label" not in df.columns:
        return True

    labelled = df["hesitation_label"].dropna().astype(str).str.strip()
    # Filter empty strings also
    labelled = labelled[labelled != ""]

    invalid = labelled[~labelled.isin(ALLOWED_LABELS)]
    if not invalid.empty:
        logger.log(f"  [ERR]  Invalid hesitation_label values found: {invalid.unique().tolist()}")
        logger.log(f"         Allowed values: {sorted(ALLOWED_LABELS)}")
        return False

    blank_count = df["hesitation_label"].isnull().sum() + (
        (df["hesitation_label"].astype(str).str.strip() == "").sum()
    )
    if blank_count > 0:
        logger.log(f"  [WARN] {blank_count} row(s) have no hesitation_label yet.")

    logger.log(f"  [OK]   All present labels are valid ({labelled.nunique()} unique class(es)).")
    return True


def check_duplicate_audio_ids(df: pd.DataFrame, logger: ReportLogger) -> bool:
    if "audio_id" not in df.columns:
        return True
    dupes = df[df.duplicated("audio_id", keep=False)]
    if not dupes.empty:
        ids = dupes["audio_id"].unique().tolist()
        logger.log(f"  [ERR]  Duplicate audio_id values found ({len(ids)}): {ids[:10]}")
        return False
    logger.log("  [OK]   No duplicate audio_id entries.")
    return True


def show_class_distribution(df: pd.DataFrame, logger: ReportLogger) -> None:
    if "hesitation_label" not in df.columns:
        return

    labelled_df = df[
        df["hesitation_label"].notna()
        & (df["hesitation_label"].astype(str).str.strip() != "")
    ]

    if labelled_df.empty:
        logger.log("  [WARN] No labelled rows yet -- class distribution unavailable.")
        return

    dist = labelled_df["hesitation_label"].value_counts().reindex(
        ["Low", "Medium", "High"], fill_value=0
    )
    total = dist.sum()
    logger.log("\n  [DIST] Class distribution:")
    for label, count in dist.items():
        pct = (count / total * 100) if total > 0 else 0
        bar = "#" * int(pct / 5)
        logger.log(f"       {label:<8} {count:>4} rows  ({pct:5.1f}%)  {bar}")
    logger.log(f"       {'TOTAL':<8} {total:>4} rows")

    for label in ["Low", "Medium", "High"]:
        if dist[label] < 30:
            logger.log(f"  [WARN] Label '{label}' has fewer than 30 rows. Collect more data.")


# ── Main ───────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Validate mockly_training.csv before model training."
    )
    parser.add_argument(
        "--file",
        default=str(Path(__file__).parent / "mockly_training.csv"),
        help="Path to the CSV file to validate.",
    )
    parser.add_argument(
        "--report",
        default=str(Path(__file__).parent / "validation_report.txt"),
        help="Path to save the validation text report.",
    )
    args = parser.parse_args()

    csv_path = Path(args.file)
    report_path = Path(args.report)

    if not csv_path.exists():
        print(f"[ERROR] File not found: {csv_path}")
        sys.exit(1)

    logger = ReportLogger(report_path)

    logger.log(f"==================================================")
    logger.log(f"Mockly Dataset Quality Validation")
    logger.log(f"==================================================")
    logger.log(f"File validated: {csv_path.name}")
    logger.log(f"Path          : {csv_path.absolute()}")
    logger.log()

    df = pd.read_csv(csv_path)
    logger.log(f"Summary Statistics:")
    logger.log(f"  Total samples : {len(df)}")
    logger.log(f"  Columns found : {list(df.columns)}")
    logger.log()

    if len(df) == 0:
        logger.log("  [WARN] CSV is empty -- no rows to validate.")
        logger.write_to_file()
        return

    logger.log("Validation Checks:")
    results = []
    results.append(check_columns(df, logger))
    results.append(check_missing_feature_values(df, logger))
    results.append(check_numeric_columns(df, logger))
    results.append(check_labels(df, logger))
    results.append(check_duplicate_audio_ids(df, logger))
    show_class_distribution(df, logger)

    logger.log()
    if all(results):
        logger.log("[OK] All checks passed successfully.")
    else:
        failed = results.count(False)
        logger.log(f"[ERR] {failed} check(s) failed. Fix issues before model training.")
        logger.write_to_file()
        sys.exit(1)

    logger.write_to_file()
    print(f"\nReport saved to {report_path}")


if __name__ == "__main__":
    main()
