"""
test_step3_api_feedback.py
---------------------------
Day 8 Step 3: Test /api/analyze API with feedback integration using backend/test.mp3.
"""

import sys
import json
import urllib.request
from pathlib import Path

BACKEND_DIR = Path(__file__).parent.parent
TEST_AUDIO = BACKEND_DIR / "test.mp3"


def test_analyze_with_feedback():
    print("==================================================")
    print("MOCKLY — DAY 8 STEP 3: API FEEDBACK INTEGRATION TEST")
    print("==================================================")

    url = "http://127.0.0.1:8000/api/analyze"

    if not TEST_AUDIO.exists():
        print(f"[ERROR] Test audio file not found at {TEST_AUDIO}")
        sys.exit(1)

    with open(TEST_AUDIO, "rb") as f:
        audio_bytes = f.read()

    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    head = f"--{boundary}\r\nContent-Disposition: form-data; name=\"audio\"; filename=\"test.mp3\"\r\nContent-Type: audio/mp3\r\n\r\n".encode("utf-8")
    tail = f"\r\n--{boundary}--\r\n".encode("utf-8")
    body = head + audio_bytes + tail

    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
    )

    try:
        res = urllib.request.urlopen(req)
        data = json.loads(res.read().decode("utf-8"))

        print("\nAPI Response Structure:")
        print(json.dumps(data, indent=2))

        # Assertions
        assert data["success"] == True
        assert "features" in data
        assert "hesitation" in data
        assert "feedback" in data

        hes = data["hesitation"]
        fb = data["feedback"]

        assert hes["model"] == "hesitation_rf_v2.joblib"
        assert hes["prediction"] in ["Low", "Medium", "High"]
        assert set(hes["probabilities"].keys()) == {"Low", "Medium", "High"}
        assert abs(sum(hes["probabilities"].values()) - 1.0) < 0.01

        assert "summary" in fb and isinstance(fb["summary"], str)
        assert "suggestions" in fb and isinstance(fb["suggestions"], list)
        assert 1 <= len(fb["suggestions"]) <= 3

        print("\n[OK] ALL ASSERTIONS PASSED SUCCESSFULLY!")
        return data

    except Exception as e:
        print(f"[ERROR] API test failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    test_analyze_with_feedback()
