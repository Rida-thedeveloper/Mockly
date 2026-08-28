"""
test_feedback.py
----------------
Day 8 Step 2: Unit tests for feedback.py module.
"""

import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from ml.feedback import generate_feedback


def run_tests():
    print("==================================================")
    print("MOCKLY — DAY 8 STEP 2: FEEDBACK LOGIC TESTS")
    print("==================================================")

    test_cases = [
        {
            "name": "Test 1: Low Prediction",
            "args": {
                "prediction": "Low",
                "probabilities": {"Low": 0.65, "Medium": 0.25, "High": 0.10},
                "wpm": 135,
                "pause_count": 2,
                "speech_duration": 25.0,
                "word_count": 56,
            },
        },
        {
            "name": "Test 2: Medium Prediction (Normal Metrics)",
            "args": {
                "prediction": "Medium",
                "probabilities": {"Low": 0.05, "Medium": 0.55, "High": 0.40},
                "wpm": 130,
                "pause_count": 3,
                "speech_duration": 30.0,
                "word_count": 65,
            },
        },
        {
            "name": "Test 3: High Prediction",
            "args": {
                "prediction": "High",
                "probabilities": {"Low": 0.02, "Medium": 0.38, "High": 0.60},
                "wpm": 115,
                "pause_count": 7,
                "speech_duration": 40.0,
                "word_count": 76,
            },
        },
        {
            "name": "Test 4: Medium + High Pause Count",
            "args": {
                "prediction": "Medium",
                "probabilities": {"Low": 0.04, "Medium": 0.54, "High": 0.42},
                "wpm": 130,
                "pause_count": 6,
                "speech_duration": 30.0,
                "word_count": 65,
            },
        },
        {
            "name": "Test 5: Medium + Unusually High WPM",
            "args": {
                "prediction": "Medium",
                "probabilities": {"Low": 0.04, "Medium": 0.54, "High": 0.42},
                "wpm": 175,
                "pause_count": 2,
                "speech_duration": 20.0,
                "word_count": 58,
            },
        },
        {
            "name": "Test 6: Medium + Unusually Low WPM",
            "args": {
                "prediction": "Medium",
                "probabilities": {"Low": 0.04, "Medium": 0.54, "High": 0.42},
                "wpm": 95,
                "pause_count": 2,
                "speech_duration": 35.0,
                "word_count": 55,
            },
        },
        {
            "name": "Test 7: Missing / Invalid Values",
            "args": {
                "prediction": None,
                "probabilities": None,
                "wpm": None,
                "pause_count": None,
                "speech_duration": None,
                "word_count": None,
            },
        },
    ]

    all_passed = True

    for tc in test_cases:
        print(f"\n--- {tc['name']} ---")
        res = generate_feedback(**tc["args"])
        print(f"Summary    : {res['summary']}")
        print("Suggestions:")
        for idx, sug in enumerate(res["suggestions"], 1):
            print(f"  {idx}. {sug}")

        # Assertions
        assert "summary" in res and isinstance(res["summary"], str)
        assert "suggestions" in res and isinstance(res["suggestions"], list)
        assert 1 <= len(res["suggestions"]) <= 3

        if tc["name"] == "Test 4: Medium + High Pause Count":
            assert "reducing unnecessary pauses" in res["suggestions"][0]
        elif tc["name"] == "Test 5: Medium + Unusually High WPM":
            assert "slowing your speaking pace" in res["suggestions"][0]
        elif tc["name"] == "Test 6: Medium + Unusually Low WPM":
            assert "more consistent speaking pace" in res["suggestions"][0]
        elif tc["name"] == "Test 7: Missing / Invalid Values":
            assert "unavailable" in res["summary"].lower()

    print("\n==================================================")
    print("ALL 7 FEEDBACK LOGIC TESTS PASSED SUCCESSFULLY!")
    print("==================================================")


if __name__ == "__main__":
    run_tests()
