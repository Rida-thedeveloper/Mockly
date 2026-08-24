from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import tempfile
import logging

from services.speech_to_text import transcribe_audio_file
from services.audio_features import extract_audio_features
from services.text_analysis import analyze_transcript

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Mockly API",
    description="Backend API for Mockly AI Interview Platform",
    version="1.0.0"
)

# Configure CORS so React frontend can communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Mockly API is running"}


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/transcribe")
async def transcribe_audio(audio: UploadFile = File(...)):
    if not audio:
        raise HTTPException(status_code=400, detail="No audio file provided")

    # Save the uploaded audio to a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
        content = await audio.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        logger.info(f"Transcribing uploaded audio file: {tmp_path}")
        # Call the dedicated service rather than hitting Whisper directly from the route
        transcript = transcribe_audio_file(tmp_path)
        logger.info("Transcription completed.")
        return {
            "success": True,
            "transcript": transcript
        }
    except Exception as e:
        logger.error(f"Error transcribing audio: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }
    finally:
        # Clean up the temporary file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


@app.post("/api/analyze")
async def analyze_audio(audio: UploadFile = File(...)):
    """
    Full analysis endpoint: runs Whisper transcription AND librosa audio feature
    extraction on the same uploaded file, returning both results together.

    Accepted formats: .webm, .mp3, .wav, .ogg (anything librosa/ffmpeg handles)
    """
    if not audio:
        raise HTTPException(status_code=400, detail="No audio file provided")

    # Preserve original extension so librosa/ffmpeg can identify the container
    original_ext = os.path.splitext(audio.filename or "recording.webm")[1] or ".webm"

    with tempfile.NamedTemporaryFile(delete=False, suffix=original_ext) as tmp:
        content = await audio.read()
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Uploaded audio file is empty")
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # ---------- Transcription ----------
        logger.info(f"[analyze] Running Whisper transcription on {tmp_path}")
        try:
            transcript = transcribe_audio_file(tmp_path)
        except Exception as e:
            logger.warning(f"[analyze] Transcription failed: {e}")
            transcript = None

        # ---------- Audio Feature Extraction ----------
        logger.info(f"[analyze] Extracting audio features from {tmp_path}")
        try:
            audio_feats = extract_audio_features(tmp_path)
        except ValueError as e:
            raise HTTPException(status_code=422, detail=str(e))
        except RuntimeError as e:
            raise HTTPException(status_code=503, detail=str(e))
        except Exception as e:
            logger.error(f"[analyze] Unexpected error in feature extraction: {e}")
            raise HTTPException(status_code=500, detail=f"Feature extraction failed: {e}")

        # ---------- Text Feature Extraction ----------
        logger.info("[analyze] Extracting text features from transcript")
        try:
            text_feats = analyze_transcript(transcript) if transcript else analyze_transcript("")
        except Exception as e:
            logger.warning(f"[analyze] Text analysis failed: {e}")
            text_feats = {"word_count": 0, "filler_count": 0, "fillers": [], "repetition_count": 0, "repeated_items": []}

        # ---------- WPM (Speaking Rate) ----------
        speech_minutes = audio_feats.get("speech_duration", 0) / 60
        word_count = text_feats.get("word_count", 0)
        wpm = round(word_count / speech_minutes) if speech_minutes > 0 else 0

        # ---------- Merge into single flat features dict ----------
        features = {
            **audio_feats,
            "word_count": word_count,
            "wpm": wpm,
            "filler_count": text_feats.get("filler_count", 0),
            "fillers": text_feats.get("fillers", []),
            "repetition_count": text_feats.get("repetition_count", 0),
            "repeated_items": text_feats.get("repeated_items", []),
        }

        logger.info("[analyze] Analysis complete.")
        return {
            "success": True,
            "transcript": transcript,
            "features": features,
        }

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

