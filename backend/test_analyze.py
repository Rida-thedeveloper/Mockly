import requests
import numpy as np
import wave
import json
import os

# Create 2 seconds of silence/noise wav file
sample_rate = 16000
duration = 2.0
samples = (np.random.rand(int(sample_rate * duration)) * 32767).astype(np.int16)

filename = "test_audio.wav"
with wave.open(filename, 'wb') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)
    wav_file.writeframes(samples.tobytes())

# Post to API
url = "http://127.0.0.1:8000/api/analyze"
with open(filename, 'rb') as f:
    files = {'audio': (filename, f, 'audio/wav')}
    data = {'question': 'Tell me about yourself.'}
    response = requests.post(url, files=files, data=data)

print(json.dumps(response.json(), indent=2))
os.remove(filename)
