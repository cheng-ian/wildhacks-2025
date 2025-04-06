from google import genai

client = genai.Client(api_key = "AIzaSyAxbFxcOrD-He0S9Tw1qwxKwEj78ER73Q4")

def generate_recipe(user_meal):
    # First, extract key words from the natural language query
    extraction_prompt = (
        "Extract the key food-related words from this query. "
        "Focus on main ingredients, meal types, and cooking styles. "
        "Return ONLY the extracted words separated by commas. "
        "Example: 'I'm craving steak tonight' -> 'steak, dinner'\n\n"
        f"Query: {user_meal}\n"
        "Extracted words:"
    )

    extraction_response = client.models.generate_content(
        model = "gemini-2.0-flash",
        contents=extraction_prompt
    )

    # Get the extracted words and clean them up
    extracted_words = extraction_response.text.strip().lower()
    print(f"Extracted words: {extracted_words}")

    # Now use the extracted words to generate the recipe
    initial_stmt = "Give me an ingredients list for " + extracted_words + ". Give me 2 things:\n\n"
    requirements = (
        "1. a CSV file of an ingredients list formatted in this format: {ingredient, amount}. Do NOT print ingredient, amount in the final CSV output.\n"
        "2. a recipe for " + extracted_words + " using these ingredients.\n\n"
    )
    format = (
        "I want the output to be formatted in this way, with the curly braces replaced with the corresponding sections of the output:\n"
        "CSV:\n{CSV output}\n"
        "Recipe:\n"
        "{Recipe output}\n\n"
        "Do NOT produce any other text. All text should be unformatted (e.g. no bold, italics, underlined, etc.)."
    )

    recipe_prompt = initial_stmt + requirements + format

    response = client.models.generate_content(
        model = "gemini-2.0-flash",
        contents=recipe_prompt
    )

    return response.text
