from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import tempfile
import logging

from services.speech_to_text import transcribe_audio_file

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

