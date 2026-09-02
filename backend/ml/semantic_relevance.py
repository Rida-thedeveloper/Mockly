from sentence_transformers import SentenceTransformer, util
import numpy as np

# Load a lightweight, CPU-friendly embeddings model locally
MODEL_NAME = "all-MiniLM-L6-v2"
_model = None

def get_mapping_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model

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
        
    model = get_mapping_model()
    # encode as tensors
    embeddings1 = model.encode(q_text, convert_to_tensor=True)
    embeddings2 = model.encode(a_text, convert_to_tensor=True)
    
    # Compute cosine similarity
    cosine_scores = util.cos_sim(embeddings1, embeddings2)
    score_float = float(cosine_scores[0][0])
    
    # Cosine similarity typically ranges from -1 to 1, but for semantic text models
    # the range is often 0 to 1 for distinct texts.
    # We calibrate the score so that moderately similar texts get partial credit,
    # and identical texts approach 100.
    # Empirical thresholds for all-MiniLM-L6-v2:
    # <= 0.1: Irrelevant
    # >= 0.7: Highly relevant
    if score_float <= 0.1:
        mapped_score = 0.0
    elif score_float >= 0.7:
        mapped_score = 100.0
    else:
        # linear mapping from [0.1, 0.7] to [0, 100]
        mapped_score = (score_float - 0.1) / (0.7 - 0.1) * 100.0
        
    final_score = int(np.clip(mapped_score, 0, 100))
    
    return final_score
