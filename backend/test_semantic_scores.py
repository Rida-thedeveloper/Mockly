from ml.semantic_relevance import calculate_relevance

question = "What is inheritance in object-oriented programming?"

answers = {
    "1. Clearly relevant": "Inheritance is a mechanism in OOP where a new class derives properties and behaviors from an existing class.",
    "2. Paraphrased but relevant": "It's when one class borrows the traits and methods of another parent class to avoid repeating code.",
    "3. Partially relevant": "Object oriented programming uses classes and objects to store data.",
    "4. Clearly irrelevant": "The sky is blue because of Rayleigh scattering in the atmosphere.",
    "5. Empty/missing answer": ""
}

print("=== Semantic Relevance Tests ===")
for name, ans in answers.items():
    score = calculate_relevance(question, ans)
    print(f"{name}: {score}%")
