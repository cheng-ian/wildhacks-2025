from google import genai

client = genai.Client(api_key = "[API_KEY]")

user_meal = "steak dinner"

initial_stmt = "Give me an ingredients list for " + user_meal + ". Give me 2 things:\n\n"
requirements = "1. a CSV file of an ingredients list formatted in this format: {ingredient, amount}. Do NOT print ingredient, amount in the final CSV output.\n" \
"2. a recipe for " + user_meal + " using these ingredients.\n\n"
format = "I want the output to be formatted in this way, with the curly braces replaced with the corresponding sections of the output:\n" \
"CSV:\n{CSV output}\n" \
"Recipe:\n" \
"{Recipe output}\n\n" \
"Do NOT produce any other text. All text should be unformatted (e.g. no bold, italics, underlined, etc.)."

prompt = initial_stmt + requirements + format

response = client.models.generate_content(
    model = "gemini-2.0-flash", contents=prompt
)

print(response.text)
