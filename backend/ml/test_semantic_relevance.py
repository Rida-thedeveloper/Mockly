from semantic_relevance import calculate_relevance

def run_tests():
    print("Testing Semantic Relevance...\n")
    
    # 1. Relevant Answer
    q1 = "Tell me about a time you handled a difficult client."
    a1 = "Once, I had a client who was very unhappy with our software delivery timeline. I scheduled a call to listen to their concerns calmly, then presented a revised step-by-step roadmap. They felt heard and we actually retained them for the next year."
    score1 = calculate_relevance(q1, a1)
    print(f"Test 1 - Relevant Answer Score: {score1}")
    
    # 2. Irrelevant Answer
    q2 = "Why do you want to work for Mockly?"
    a2 = "I really enjoy eating pizza with extra cheese on Fridays. It's just my favorite thing to do when I watch movies."
    score2 = calculate_relevance(q2, a2)
    print(f"Test 2 - Irrelevant Answer Score: {score2}")

    # 3. Empty strings
    q3 = ""
    a3 = ""
    score3 = calculate_relevance(q3, a3)
    print(f"Test 3 - Empty string Score: {score3}")
    
    # 4. Partial empty
    score4 = calculate_relevance(q1, "")
    print(f"Test 4 - Missing Answer Score: {score4}")

if __name__ == "__main__":
    run_tests()
