"""
speech_to_text.py
-----------------
Transcription via Groq Speech-to-Text API (whisper-large-v3-turbo).

Local Whisper / PyTorch removed to eliminate Railway OOM issues.
The function interface (transcribe_audio_file) is unchanged so all
downstream analysis continues to work without modification.

NOTE: imageio_ffmpeg PATH setup is retained because librosa / audio
features still require an ffmpeg executable at runtime.
"""

import logging
import os

logger = logging.getLogger(__name__)

# ── FFmpeg PATH setup ─────────────────────────────────────────────────────────
# Keep this block: librosa uses ffmpeg to decode .webm for audio-feature
# extraction.  Do NOT remove until audio_features.py is verified to not need it.
try:
    import imageio_ffmpeg
    import shutil

    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    ffmpeg_dir = os.path.dirname(ffmpeg_exe)

    # On Linux (Railway) the binary is already called "ffmpeg"; the alias is
    # only needed on Windows where imageio names it differently.
    target_ffmpeg = os.path.join(ffmpeg_dir, "ffmpeg")
    if not os.path.exists(target_ffmpeg):
        shutil.copyfile(ffmpeg_exe, target_ffmpeg)
        logger.info(f"Created ffmpeg alias at: {target_ffmpeg}")

    if ffmpeg_dir not in os.environ.get("PATH", ""):
        os.environ["PATH"] = ffmpeg_dir + os.pathsep + os.environ.get("PATH", "")
        logger.info(f"Added FFmpeg directory to PATH: {ffmpeg_dir}")
except Exception as err:
    logger.warning(f"imageio_ffmpeg PATH setup skipped: {err}")

# ── Groq client ───────────────────────────────────────────────────────────────
try:
    from groq import Groq
    _groq_available = True
except ImportError:
    _groq_available = False
    logger.warning("groq package not installed – transcription will return a placeholder.")


def transcribe_audio_file(audio_path: str) -> str:
    """
    Send an audio file to the Groq Speech-to-Text API and return the transcript.

    Accepts the same file path that was previously passed to local Whisper;
    the rest of the analysis pipeline is completely unchanged.

    Returns a plain Python str in all cases (never raises so the caller's
    try/except can decide how to handle degraded output).
    """
    if not _groq_available:
        logger.error("groq package missing – cannot transcribe.")
        return "Transcription unavailable: groq package not installed."

    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not api_key:
        logger.error("GROQ_API_KEY environment variable is not set.")
        return "Transcription unavailable: GROQ_API_KEY not configured."

    if not os.path.exists(audio_path):
        logger.error(f"Audio file not found: {audio_path}")
        return "Transcription unavailable: audio file missing."

    try:
        client = Groq(api_key=api_key)
        with open(audio_path, "rb") as audio_file:
            logger.info(f"[Groq STT] Sending {audio_path} to whisper-large-v3-turbo …")
            transcription = client.audio.transcriptions.create(
                model="whisper-large-v3-turbo",
                file=audio_file,
                response_format="text",
                # Prompt Groq/Whisper to preserve filler words exactly as local
                # Whisper did, so hesitation analysis remains accurate.
                prompt="Umm, let me think, uhh, like, you know...",
                language="en",
            )
        # When response_format="text", the SDK returns the transcript as a
        # plain string directly (not a structured object).
        if isinstance(transcription, str):
            result = transcription.strip()
        else:
            result = (transcription.text or "").strip()

        logger.info(f"[Groq STT] Transcript received ({len(result)} chars).")
        return result if result else "No speech detected in the recording."

    except Exception as err:
        logger.error(f"[Groq STT] Transcription error: {err}")
        return f"Audio recorded successfully. (Transcription notice: {err})"
