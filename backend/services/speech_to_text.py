import logging
import os
import shutil

logger = logging.getLogger(__name__)

# Ensure FFmpeg is available and named ffmpeg.exe for Whisper's subprocess execution
try:
    import imageio_ffmpeg
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    ffmpeg_dir = os.path.dirname(ffmpeg_exe)
    target_ffmpeg_exe = os.path.join(ffmpeg_dir, "ffmpeg.exe")
    
    # Copy/Alias the binary to 'ffmpeg.exe' so Whisper subprocess can locate it by name
    if not os.path.exists(target_ffmpeg_exe):
        shutil.copyfile(ffmpeg_exe, target_ffmpeg_exe)
        logger.info(f"Created ffmpeg.exe alias at: {target_ffmpeg_exe}")
        
    if ffmpeg_dir not in os.environ.get("PATH", ""):
        os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")
        logger.info(f"Added FFmpeg directory to PATH: {ffmpeg_dir}")
except Exception as err:
    logger.warning(f"Could not setup imageio_ffmpeg alias: {err}")

# Cache the model so we don't reload it every time
_model = None
_whisper_available = True

try:
    import whisper
except ImportError:
    _whisper_available = False
    logger.warning("Whisper library not found. Falling back to mock transcription until PyTorch/Whisper installation completes.")

def load_whisper_model():
    global _model, _whisper_available
    if not _whisper_available:
        return None
    if _model is None:
        logger.info("Loading Whisper model... (using 'tiny' for fast download and high speed)")
        try:
            _model = whisper.load_model("tiny")
            logger.info("Whisper 'tiny' model loaded successfully!")
        except Exception as e:
            logger.warning(f"Failed to load Whisper 'tiny', trying 'base': {e}")
            try:
                _model = whisper.load_model("base")
            except Exception as e2:
                logger.error(f"Failed to load Whisper model: {e2}")
                return None
    return _model

def transcribe_audio_file(audio_path: str) -> str:
    """
    Accepts an audio file path and returns the transcript using local Whisper.
    """
    model = load_whisper_model()
    
    if model is None:
        return "Audio response captured. (Whisper speech-to-text model loading)"
    
    try:
        # Passing an initial_prompt with filler words strongly encourages the Whisper model 
        # to NOT filter out hesitations (like "uh", "um") from the user's speech.
        result = model.transcribe(
            audio_path,
            initial_prompt="Umm, let me think, uhh, like, you know...",
            fp16=False  # Disable FP16 warning on CPU
        )
        return result.get("text", "").strip()
    except Exception as err:
        logger.error(f"Whisper transcription error: {err}")
        return f"Audio recorded successfully. (Whisper processing notice: {err})"
