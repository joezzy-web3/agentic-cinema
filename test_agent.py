import os
from dotenv import load_dotenv
from google import genai
from parallel import Parallel

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PARALLEL_API_KEY = os.getenv("PARALLEL_API_KEY")

print("1. Initializing API clients...")
gemini_client = genai.Client(api_key=GEMINI_API_KEY)
parallel_client = Parallel(api_key=PARALLEL_API_KEY)

query = "shortlet apartment film production location Victoria Island Lekki Lagos daily rate"

print(f"\n2. Querying Parallel Web Search API for:\n'{query}'...")

try:
    search_results = parallel_client.search(
        search_queries=[query]
    )
    
    print("\n--- Raw Search Results Received ---")
    print(search_results)

    print("\n3. Processing findings with Gemini...")
    extraction_prompt = f"""
    You are a Location Scouting AI Agent for film production teams.
    Extract key venue/location candidates from the raw search data below.
    
    Return a structured list of candidates with these fields:
    - Name
    - Address/Area
    - Price Per Day (or estimated rate)
    - Match Score (%)
    - Source URL
    - Notes (Why it fits a movie shoot)

    Raw Data:
    {search_results}
    """

    response = gemini_client.models.generate_content(
        model="gemini-3.6-flash",
        contents=extraction_prompt
    )

    print("\n================ GEMINI EXTRACTED LOCATIONS ================")
    print(response.text)
    print("============================================================")

except Exception as e:
    print(f"\nError occurred: {e}")
