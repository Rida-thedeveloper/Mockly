import os
import sys

# Ensure the parent directory is in sys.path so we can import services
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))

from services.speech_to_text import transcribe_audio_file

def main():
    # If the user provides a filename, use it. Otherwise default to searching for test.mp3 then test.wav
    if len(sys.argv) > 1:
        test_file = sys.argv[1]
    else:
        test_file = "test.mp3" if os.path.exists("test.mp3") else "test.wav"
    
    if not os.path.exists(test_file):
        print(f"Error: Could not find '{test_file}' in the current directory.")
        print("Please provide a valid audio file as an argument or place a 'test.mp3'/'test.wav' file in the 'backend' folder.")
        sys.exit(1)
        
    print(f"Starting transcription for '{test_file}'...")
    try:
        text = transcribe_audio_file(test_file)
        print("\n=== Transcript Result ===")
        print(text)
        print("=========================\n")
    except Exception as e:
        print(f"An error occurred during transcription: {e}")

if __name__ == "__main__":
    main()
