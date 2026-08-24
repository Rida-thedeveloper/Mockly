"""
text_analysis.py
----------------
Extracts linguistic/text features from a Whisper transcript string.

Features computed:
  - word_count       : total word count in the transcript
  - filler_count     : total number of filler word occurrences
  - fillers          : ordered list of unique filler words that were found
  - repetition_count : number of immediate word-to-word repetitions
  - repeated_items   : list of words that were immediately repeated

Filler word matching uses word-boundary-aware regex so that words like
"basically" don't match inside "basically-done", and "um" doesn't match
inside "umbrella".
"""

import re
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Default filler word list — extend freely, order does not matter
# ---------------------------------------------------------------------------
DEFAULT_FILLERS = [
    "um", "uh", "hmm", "like", "basically",
    "actually", "you know",
]


def analyze_transcript(
    transcript: str,
    filler_words: Optional[list[str]] = None,
) -> dict:
    """
    Analyse a plain-text transcript string and return a feature dictionary.

    Parameters
    ----------
    transcript : str
        Raw transcript text as returned by Whisper (or any STT engine).
    filler_words : list[str] | None
        Custom filler word list.  Falls back to DEFAULT_FILLERS when None.

    Returns
    -------
    dict with keys:
        word_count, filler_count, fillers, repetition_count, repeated_items
    """
    if not transcript or not transcript.strip():
        return {
            "word_count": 0,
            "filler_count": 0,
            "fillers": [],
            "repetition_count": 0,
            "repeated_items": [],
        }

    if filler_words is None:
        filler_words = DEFAULT_FILLERS

    # Normalise: lower-case, collapse whitespace, strip punctuation from
    # word boundaries while keeping internal apostrophes (contractions).
    clean = transcript.lower()

    # -----------------------------------------------------------------------
    # 1. Word count
    #    Split on whitespace after stripping leading/trailing punctuation from
    #    each token (handles commas, periods, ellipsis, etc.)
    # -----------------------------------------------------------------------
    raw_tokens = re.findall(r"[a-z']+", clean)
    word_count = len(raw_tokens)

    # -----------------------------------------------------------------------
    # 2. Filler word detection — word-boundary-aware
    #    Multi-word fillers (e.g. "you know") are matched first to avoid
    #    double-counting their individual words.
    # -----------------------------------------------------------------------
    # Sort by length descending so multi-word phrases are checked before
    # single words ("you know" before "know").
    sorted_fillers = sorted(filler_words, key=lambda f: -len(f))

    filler_occurrences: list[str] = []     # every individual hit in order
    found_unique: list[str] = []            # ordered unique hits for "fillers" key

    for filler in sorted_fillers:
        # Build a word-boundary pattern; spaces inside a phrase are replaced
        # with \s+ to tolerate any whitespace amount.
        escaped = re.escape(filler).replace(r"\ ", r"\s+")
        # Allow the final character to be repeated (e.g. "um" matches "umm",
        # "uh" matches "uhh", "hmm" matches "hmmm") to catch elongated speech.
        last_char = re.escape(filler[-1])
        pattern = rf"\b{escaped}{last_char}*\b"
        matches = re.findall(pattern, clean)
        if matches:
            filler_occurrences.extend(matches)
            # Record the canonical form (the filler key, not the matched text)
            if filler not in found_unique:
                found_unique.append(filler)

    filler_count = len(filler_occurrences)
    # Preserve order of first occurrence across the text
    last_char_of = {f: re.escape(f[-1]) for f in found_unique}
    found_unique_ordered = sorted(
        found_unique,
        key=lambda f: (
            re.search(rf"\b{re.escape(f)}{last_char_of[f]}*\b", clean) or re.search("", "")
        ).start()
    )

    # -----------------------------------------------------------------------
    # 3. Immediate word repetition detection
    #    "I worked worked on" → "worked" is a repetition.
    #    Comparison is case-insensitive; punctuation is ignored at boundaries.
    #    Only consecutive identical tokens count (not general repetition).
    # -----------------------------------------------------------------------
    repeated_items: list[str] = []
    repetition_count = 0

    for i in range(1, len(raw_tokens)):
        prev = raw_tokens[i - 1].strip("'")   # strip leading/trailing apostrophes
        curr = raw_tokens[i].strip("'")
        if prev and curr and prev == curr and len(prev) > 1:
            repetition_count += 1
            if prev not in repeated_items:
                repeated_items.append(prev)

    return {
        "word_count": word_count,
        "filler_count": filler_count,
        "fillers": found_unique_ordered,
        "repetition_count": repetition_count,
        "repeated_items": repeated_items,
    }
