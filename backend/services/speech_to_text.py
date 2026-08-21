import whisper
import logging

logger = logging.getLogger(__name__)

# Cache the model so we don't reload it every time
_model = None

def load_whisper_model():
    global _model
    if _model is None:
        logger.info("Loading Whisper 'base' model... (this may take a bit)")
        _model = whisper.load_model("base")
    return _model

def transcribe_audio_file(audio_path: str) -> str:
    """
    Accepts an audio file path and returns the transcript using local Whisper.
    """
    model = load_whisper_model()
    
    # Passing an initial_prompt with filler words strongly encourages the Whisper model 
    # to NOT filter out hesitations (like "uh", "um") from the user's speech.
    result = model.transcribe(
        audio_path,
        initial_prompt="Umm, let me think, uhh, like, you know..."
    )
    return result.get("text", "").strip()
