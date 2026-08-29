from sentence_transformers import SentenceTransformer, util
import numpy as np

# Load a lightweight, CPU-friendly embeddings model locally
MODEL_NAME = "all-MiniLM-L6-v2"
model = SentenceTransformer(MODEL_NAME)

def calculate_relevance(question: str, answer: str) -> int:
    """
    Computes an embeddings-based semantic similarity score between
    the interview question and the user's transcript.
    Returns an integer 0-100 indicating relevance.
    """
    if not question or not answer:
        return 0
    
    q_text = question.strip()
    a_text = answer.strip()
    
    if not q_text or not a_text:
        return 0
        
    # encode as tensors
    embeddings1 = model.encode(q_text, convert_to_tensor=True)
    embeddings2 = model.encode(a_text, convert_to_tensor=True)
    
    # Compute cosine similarity
    cosine_scores = util.cos_sim(embeddings1, embeddings2)
    score_float = float(cosine_scores[0][0])
    
    # Cosine similarity typically ranges from -1 to 1, but for semantic text models
    # the range is often 0 to 1 for distinct texts, or negatives for very opposed.
    # We map any negative values to 0, and max to 100.
    final_score = int(np.clip(score_float * 100, 0, 100))
    
    return final_score
