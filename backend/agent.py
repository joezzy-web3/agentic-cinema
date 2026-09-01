import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
import httpx
from pydantic import BaseModel, Field
from typing import List, Optional

load_dotenv()

class LocationCandidate(BaseModel):
    name: str = Field(description="Name or short title of the location listing")
    address_area: str = Field(description="Neighborhood or specific area, e.g. Lekki Phase 1, Victoria Island")
    price_per_day: str = Field(description="Daily rate in local currency or USD")
    permit_status: str = Field(description="Information regarding film permit, shooting clearance, or residential rules")
    match_score: int = Field(description="Percentage score (0-100) matching visual reference and budget")
    source_url: str = Field(description="Link to original listing source")
    notes: str = Field(description="Key visual features matching the film reference")

class LocationSearchResult(BaseModel):
    query_used: str
    visual_description: str
    candidates: List[LocationCandidate]

async def run_agentic_scout(image_bytes: bytes, image_mime: str, city: str, budget: str) -> LocationSearchResult:
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        raise ValueError("GEMINI_API_KEY is missing from environment or .env file")

    client = genai.Client(api_key=gemini_key)

    # 1. Gemini Visual Analysis
    vision_prompt = """
    Analyze this location reference photo for film production scene selection.
    Identify and describe:
    - Architectural style & interior design
    - Lighting & color palette
    - Setting type (e.g., luxury penthouse, modern villa, minimalist apartment, rustic home)
    - Mood & tone
    Summarize in 2 concise sentences.
    """
    
    vision_response = client.models.generate_content(
        model='gemini-3.6-flash',
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type=image_mime),
            vision_prompt
        ]
    )
    visual_desc = vision_response.text

    # 2. Query Builder
    search_query = f"shortlet apartment film production location {city} {budget} {visual_desc[:80]}"
    
    # 3. Parallel Search API Call
    parallel_api_key = os.getenv("PARALLEL_API_KEY")
    search_data = {}
    
    async with httpx.AsyncClient(timeout=30.0) as http_client:
        try:
            parallel_resp = await http_client.post(
                "https://api.parallel.ai/v1/search",
                headers={
                    "Authorization": f"Bearer {parallel_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "search_queries": [search_query],
                    "objective": f"Find film shooting location shortlet apartments in {city} within budget {budget}",
                    "max_results": 5
                }
            )
            if parallel_resp.status_code == 200:
                search_data = parallel_resp.json()
            else:
                print(f"Parallel API Warning: Status {parallel_resp.status_code} - {parallel_resp.text}")
        except Exception as e:
            print(f"Parallel Search Error: {str(e)}")

    # 4. Gemini Extraction & Ranking into Structured JSON
    extraction_prompt = f"""
    Target Location Constraints: City/Area={city}, Budget={budget}.
    Visual Aesthetic Description: {visual_desc}
    
    Raw Search Results from Parallel Web Search:
    {json.dumps(search_data)}
    
    Extract and rank candidate locations matching these details. Return structured data matching the schema.
    """

    extraction_response = client.models.generate_content(
        model='gemini-3.6-flash',
        contents=extraction_prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=LocationSearchResult,
        ),
    )
    
    result = LocationSearchResult.model_validate_json(extraction_response.text)
    result.visual_description = visual_desc
    result.query_used = search_query
    return result
