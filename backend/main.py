import os
from typing import List
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google import genai
from google.genai import types
from pydantic import BaseModel

app = FastAPI(title="Agentic Cinema API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LocationItem(BaseModel):
    name: str
    category: str
    aesthetic: str
    estimated_cost: str
    logistics: str
    image_keyword: str

class LocationResponse(BaseModel):
    locations: List[LocationItem]

@app.get("/")
def read_root():
    return {"status": "Agentic Cinema Backend active"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return JSONResponse(
        status_code=200,
        content={"status": "ok"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
    )

@app.post("/scout")
async def scout_location(request: Request):
    try:
        data = await request.json()
        city = data.get("query", "London")
        budget = data.get("budget", "1500")
        currency = data.get("currency", "USD")
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": "GEMINI_API_KEY is not configured on Render."}
            )
            
        client = genai.Client(api_key=api_key)
        
        prompt = (
            f"You are a global film location scout. Provide 3 real, specific shooting location recommendations "
            f"in or around '{city}' for a production with a daily location permit budget of {currency} {budget}.\n"
            f"- Output realistic permit costs in the requested currency ({currency}) or local equivalent.\n"
            f"- Provide actionable logistics notes tailored to filming in '{city}' (permits, access, power, acoustics).\n"
            f"- For image_keyword, provide a single English architectural/environmental keyword (e.g., quarry, gallery, waterfront, cathedral, alleyway, skyscraper)."
        )
        
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=LocationResponse,
            ),
        )
        
        parsed_data = LocationResponse.model_validate_json(response.text)
        locations_list = []

        # High-resolution Unsplash photography matching global scenery
        for loc in parsed_data.locations:
            kw = loc.image_keyword.lower()
            img_url = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"
            
            if "quarry" in kw or "rock" in kw or "mountain" in kw:
                img_url = "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=1000&q=80"
            elif "gallery" in kw or "art" in kw or "museum" in kw or "modern" in kw or "architecture" in kw:
                img_url = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
            elif "reservoir" in kw or "dam" in kw or "lake" in kw or "water" in kw or "beach" in kw:
                img_url = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
            elif "park" in kw or "forest" in kw or "nature" in kw:
                img_url = "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80"
            elif "city" in kw or "street" in kw or "skyscraper" in kw or "alley" in kw:
                img_url = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80"
                
            locations_list.append({
                "name": loc.name,
                "category": loc.category,
                "aesthetic": loc.aesthetic,
                "estimated_cost": loc.estimated_cost,
                "logistics": loc.logistics,
                "image_url": img_url
            })
        
        return {
            "status": "success",
            "city": city,
            "budget": budget,
            "currency": currency,
            "locations": locations_list
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )
