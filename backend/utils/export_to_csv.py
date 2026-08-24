"""
export_to_csv.py
----------------
Export a real feature response from Mockly's /api/analyze endpoint
into dataset/mockly_training.csv (or a custom CSV).

Usage — from the Mockly root directory:
    python backend/utils/export_to_csv.py \\
        --audio path/to/recording.webm \\
        --audio-id rec_001 \\
        --question-id q_01

    # Optionally provide a label immediately (only if already annotated):
    python backend/utils/export_to_csv.py \\
        --audio path/to/recording.webm \\
        --audio-id rec_001 \\
        --question-id q_01 \\
        --label Medium

Options:
    --audio        Path to the .webm / .mp3 / .wav audio file
    --audio-id     Unique identifier for this recording   (e.g. rec_001)
    --question-id  Interview question identifier           (e.g. q_01)
    --label        Hesitation label: Low | Medium | High   (default: blank)
    --api          Base URL of the FastAPI backend          (default: http://localhost:8000)
    --out          CSV file to append to                    (default: dataset/mockly_training.csv)
    --dry-run      Print the row without writing to CSV
"""

import argparse
import csv
import sys
import uuid
from pathlib import Path

try:
    import requests
except ImportError:
    print("[ERROR] requests is not installed. Run: pip install requests")
    sys.exit(1)

# ── Constants ──────────────────────────────────────────────────────────────────

COLUMNS = [
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

ALLOWED_LABELS = {"Low", "Medium", "High", ""}

DEFAULT_API = "http://localhost:8000"
DEFAULT_OUT = Path(__file__).parent.parent.parent / "dataset" / "mockly_training.csv"


# ── Core ───────────────────────────────────────────────────────────────────────

def call_analyze(audio_path: Path, api_base: str) -> dict:
    """POST the audio file to /api/analyze and return the JSON response."""
    url = f"{api_base.rstrip('/')}/api/analyze"
    print(f"  -> Sending '{audio_path.name}' to {url} ...")
    with open(audio_path, "rb") as f:
        response = requests.post(
            url,
            files={"audio": (audio_path.name, f, "audio/webm")},
            timeout=120,
        )
    response.raise_for_status()
    data = response.json()
    if not data.get("success"):
        raise RuntimeError(f"API returned success=false: {data}")
    return data


def build_row(
    features: dict,
    audio_id: str,
    question_id: str,
    label: str,
) -> dict:
    """Map API features dict to the CSV row schema."""
    return {
        "audio_id": audio_id,
        "question_id": question_id,
        "wpm": features.get("wpm", ""),
        "pause_count": features.get("pause_count", ""),
        "speech_duration": features.get("speech_duration", ""),
        "word_count": features.get("word_count", ""),
        "average_pause": features.get("average_pause", ""),
        "silence_ratio": features.get("silence_ratio", ""),
        "long_pause_count": features.get("long_pause_count", ""),
        "filler_count": features.get("filler_count", ""),
        "repetition_count": features.get("repetition_count", ""),
        "hesitation_label": label,          # blank until human annotates
    }


def append_to_csv(row: dict, csv_path: Path) -> None:
    """Append one row to the CSV, creating the file with headers if needed."""
    file_exists = csv_path.exists() and csv_path.stat().st_size > 0
    with open(csv_path, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=COLUMNS)
        if not file_exists:
            writer.writeheader()
        writer.writerow(row)
    print(f"  [OK] Row appended to {csv_path}")


def print_row(row: dict) -> None:
    print("\n  Exported row:")
    print("  " + ",".join(COLUMNS))
    print("  " + ",".join(str(row.get(c, "")) for c in COLUMNS))


# ── CLI ────────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Export Mockly /api/analyze features to the training CSV."
    )
    parser.add_argument("--audio", required=True, help="Path to audio file")
    parser.add_argument(
        "--audio-id",
        default=None,
        help="Unique recording ID (auto-generated UUID if omitted)",
    )
    parser.add_argument("--question-id", default="q_unknown", help="Question ID")
    parser.add_argument(
        "--label",
        default="",
        choices=["Low", "Medium", "High", ""],
        help="Hesitation label (leave blank if not yet annotated)",
    )
    parser.add_argument("--api", default=DEFAULT_API, help="FastAPI base URL")
    parser.add_argument("--out", default=str(DEFAULT_OUT), help="Output CSV path")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print row only, do not write to CSV",
    )
    args = parser.parse_args()

    audio_path = Path(args.audio)
    if not audio_path.exists():
        print(f"[ERROR] Audio file not found: {audio_path}")
        sys.exit(1)

    audio_id = args.audio_id or f"rec_{uuid.uuid4().hex[:8]}"

    print(f"\nExporting recording: {audio_path.name}")
    print(f"   audio_id    : {audio_id}")
    print(f"   question_id : {args.question_id}")
    print(f"   label       : '{args.label}' (blank = needs annotation)\n")

    # Call the API
    try:
        result = call_analyze(audio_path, args.api)
    except requests.exceptions.ConnectionError:
        print(
            "[ERROR] Could not connect to the FastAPI backend.\n"
            f"        Make sure it is running at: {args.api}"
        )
        sys.exit(1)
    except Exception as exc:
        print(f"[ERROR] {exc}")
        sys.exit(1)

    features = result.get("features", {})
    row = build_row(features, audio_id, args.question_id, args.label)
    print_row(row)

    if args.dry_run:
        print("\n  ℹ️  Dry-run mode — CSV not modified.")
        return

    csv_path = Path(args.out)
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    append_to_csv(row, csv_path)


if __name__ == "__main__":
    main()
