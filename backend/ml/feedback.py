"""
feedback.py
-----------
Day 8 Step 2: Practical Interview Feedback Generator.

Generates structured, non-judgmental feedback based on:
  - Random Forest prediction ("Low", "Medium", "High")
  - Speech metrics (wpm, pause_count, speech_duration, word_count)

HEURISTIC DISCLAIMER:
Metric thresholds (e.g., WPM < 110 or WPM > 160, pause_count > 4) are simple
heuristic guidelines suited for interview practice. They are NOT clinical,
medical, or scientifically established disfluency benchmarks.
"""

import logging
from typing import Optional, Dict, Any, List

logger = logging.getLogger(__name__)


def generate_feedback(
    prediction: Optional[str],
    probabilities: Optional[Dict[str, float]] = None,
    wpm: Optional[float] = None,
    pause_count: Optional[int] = None,
    speech_duration: Optional[float] = None,
    word_count: Optional[int] = None,
) -> Dict[str, Any]:
    """
    Generate interview feedback summary and suggestions based on ML prediction and speech metrics.

    Parameters
    ----------
    prediction : str | None
        Predicted communication level ("Low", "Medium", "High").
    probabilities : dict | None
        Probabilities dict for classes ("Low", "Medium", "High").
    wpm : float | None
        Speaking rate in words per minute.
    pause_count : int | None
        Number of detected pauses.
    speech_duration : float | None
        Speech duration in seconds.
    word_count : int | None
        Transcribed word count.

    Returns
    -------
    dict
        {
            "summary": str,
            "suggestions": list[str]
        }
    """
    # Safe fallback if prediction or metrics are missing/invalid
    if not prediction or not isinstance(prediction, str):
        return {
            "summary": "Feedback unavailable due to incomplete speech analysis.",
            "suggestions": [
                "Ensure your microphone is clear and record a complete verbal response."
            ],
        }

    pred_clean = prediction.strip().capitalize()
    suggestions: List[str] = []

    # 1. LOW Hesitation Prediction
    if pred_clean == "Low":
        summary = "Your speech showed relatively low signs associated with hesitation."
        suggestions = [
            "Maintain your current speaking rhythm.",
            "Continue answering with clear and structured points.",
            "Keep practicing concise and direct responses.",
        ]

    # 2. MEDIUM Hesitation Prediction
    elif pred_clean == "Medium":
        summary = "Your speech showed moderate hesitation patterns during the response."

        # Apply heuristic metric-based suggestions
        metric_suggestion_added = False

        if pause_count is not None and pause_count >= 5:
            suggestions.append("Try reducing unnecessary pauses between ideas.")
            metric_suggestion_added = True

        if wpm is not None:
            if wpm > 160:
                suggestions.append(
                    "Try slowing your speaking pace slightly so your answers are easier to follow."
                )
                metric_suggestion_added = True
            elif wpm < 110 and wpm > 0:
                suggestions.append(
                    "Try maintaining a slightly more consistent speaking pace."
                )
                metric_suggestion_added = True

        if not metric_suggestion_added:
            suggestions.append(
                "Focus on maintaining a steady speaking rhythm while organizing your answer."
            )

        # Additional constructive interview suggestions
        suggestions.append(
            "Pause briefly before starting your response to outline your main points."
        )
        suggestions.append(
            "Practice answering common interview questions aloud to build speaking flow."
        )

    # 3. HIGH Hesitation Prediction
    elif pred_clean == "High":
        summary = "Your speech showed higher frequency of hesitation characteristics during the answer."
        suggestions = [
            "Prepare the key points of your answer before speaking.",
            "Use a simple answer structure such as Situation -> Action -> Result (STAR).",
            "Maintain a steady speaking rhythm and reduce unnecessary pauses where possible.",
        ]

    # Fallback for unrecognized predictions
    else:
        summary = "Speech analysis complete."
        suggestions = [
            "Focus on clear structure and steady pacing in your interview practice."
        ]

    # Cap suggestions to 2-3 items for conciseness
    return {
        "summary": summary,
        "suggestions": suggestions[:3],
    }
