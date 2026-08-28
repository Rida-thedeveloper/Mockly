"""
audio_features.py
-----------------
Extracts acoustic/timing features from a recorded audio file using librosa.

Features computed:
  - duration          : total audio length in seconds
  - speech_duration   : seconds of audio above the silence threshold
  - silence_duration  : seconds of audio below the silence threshold
  - silence_ratio     : silence_duration / duration
  - pause_count       : number of discrete silent segments (pauses)
  - average_pause     : mean length of those silent segments (seconds)
  - longest_pause     : length of the single longest silent segment (seconds)
  - long_pause_count  : number of pauses that exceed long_pause_threshold

Thresholds are intentionally configurable so they can be tuned without
changing the caller. Defaults suited for interview audio:

  silence_db_threshold = -40 dB  (anything quieter is silence)
  min_silence_duration =  0.30 s (shorter gaps are not counted as pauses)
  long_pause_threshold =  1.00 s (pauses this long count as 'long pauses')
"""

import logging
import os
import subprocess
import tempfile
import wave

import numpy as np

logger = logging.getLogger(__name__)


def _get_ffmpeg_exe() -> str:
    """Return the path to an ffmpeg binary, preferring imageio_ffmpeg."""
    try:
        import imageio_ffmpeg
        exe = imageio_ffmpeg.get_ffmpeg_exe()
        logger.debug(f"Using imageio_ffmpeg binary: {exe}")
        return exe
    except Exception:
        # Fall back to system ffmpeg if imageio_ffmpeg is unavailable
        return "ffmpeg"


def _ensure_wav(audio_path: str) -> tuple[str, bool]:
    """
    Transcode audio file to a temporary 16kHz mono WAV via ffmpeg.
    Returns (tmp_wav_path, True).
    """
    ffmpeg = _get_ffmpeg_exe()
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    tmp.close()

    cmd = [
        ffmpeg, "-y",           # overwrite without asking
        "-i", audio_path,       # input
        "-vn",                  # drop video stream (webm may have it)
        "-acodec", "pcm_s16le", # 16-bit PCM
        "-ar", "16000",         # resample to 16 kHz
        "-ac", "1",             # mono
        tmp.name,
    ]

    try:
        result = subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=60,
        )
        if result.returncode != 0:
            err = result.stderr.decode(errors="replace")
            raise ValueError(f"ffmpeg transcoding failed: {err}")
    except FileNotFoundError:
        raise RuntimeError(
            "ffmpeg not found. Install imageio-ffmpeg (pip install imageio-ffmpeg) "
            "or add ffmpeg to your system PATH."
        )

    return tmp.name, True


def extract_audio_features(
    audio_path: str,
    silence_db_threshold: float = -40.0,
    min_silence_duration: float = 0.30,
    long_pause_threshold: float = 1.00,
) -> dict:
    """
    Analyse an audio file and return a flat dictionary of acoustic features.
    Uses ffmpeg, standard library `wave`, and NumPy for high robustness.
    """
    wav_path, is_tmp = _ensure_wav(audio_path)
    try:
        with wave.open(wav_path, "rb") as wf:
            sr = wf.getframerate()
            raw_bytes = wf.readframes(wf.getnframes())
            y = np.frombuffer(raw_bytes, dtype=np.int16).astype(np.float32) / 32768.0
    except Exception as e:
        # Fall back to librosa if wave reading fails for any reason
        try:
            import librosa
            y, sr = librosa.load(wav_path, sr=None, mono=True)
        except Exception as err:
            raise ValueError(f"Could not load audio file '{audio_path}': {err}") from err
    finally:
        if is_tmp and os.path.exists(wav_path):
            os.remove(wav_path)

    if len(y) == 0:
        raise ValueError("Audio file appears to be empty or unreadable.")

    # 2. Compute short-time RMS energy via NumPy
    hop_length = 512
    frame_length = 1024

    if len(y) < frame_length:
        # Pad short audio
        y = np.pad(y, (0, frame_length - len(y)))

    num_frames = 1 + (len(y) - frame_length) // hop_length
    shape = (num_frames, frame_length)
    strides = (y.strides[0] * hop_length, y.strides[0])
    frames = np.lib.stride_tricks.as_strided(y, shape=shape, strides=strides)
    rms = np.sqrt(np.mean(frames ** 2, axis=1))

    # Convert to dB (ref = max RMS)
    ref = float(np.max(rms)) if len(rms) > 0 and np.max(rms) > 0 else 1.0
    rms_db = 20.0 * np.log10(np.maximum(rms, 1e-9) / ref)

    # Boolean mask: True where the frame is silent
    is_silent_frame = rms_db < silence_db_threshold

    frame_duration = hop_length / sr
    total_frames = len(is_silent_frame)

    # 3. Total / speech / silence durations
    total_duration = float(len(y) / sr)
    silence_frames = int(np.sum(is_silent_frame))
    speech_frames = total_frames - silence_frames

    silence_duration = round(silence_frames * frame_duration, 3)
    speech_duration = round(speech_frames * frame_duration, 3)
    silence_ratio = round(silence_duration / total_duration, 4) if total_duration > 0 else 0.0

    # 4. Identify contiguous silent segments (pauses)
    min_silence_frames = int(min_silence_duration / frame_duration)

    pauses = []
    in_pause = False
    pause_start = 0

    for i, silent in enumerate(is_silent_frame):
        if silent and not in_pause:
            in_pause = True
            pause_start = i
        elif not silent and in_pause:
            in_pause = False
            run_length = i - pause_start
            if run_length >= min_silence_frames:
                pauses.append(round(run_length * frame_duration, 3))

    # Handle trailing pause at end of audio
    if in_pause:
        run_length = total_frames - pause_start
        if run_length >= min_silence_frames:
            pauses.append(round(run_length * frame_duration, 3))

    pause_count = len(pauses)
    average_pause = round(float(np.mean(pauses)), 3) if pauses else 0.0
    longest_pause = round(float(np.max(pauses)), 3) if pauses else 0.0
    long_pause_count = int(sum(1 for p in pauses if p >= long_pause_threshold))

    # 5. Return clean result dictionary
    return {
        "duration": round(total_duration, 3),
        "speech_duration": speech_duration,
        "silence_duration": silence_duration,
        "silence_ratio": silence_ratio,
        "pause_count": pause_count,
        "average_pause": average_pause,
        "longest_pause": longest_pause,
        "long_pause_count": long_pause_count,
    }
