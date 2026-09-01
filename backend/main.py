import os
import json
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google import genai

app = FastAPI(title="Agentic Cinema API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        city = data.get("query", "Abuja")
        budget = data.get("budget", "200000")
        
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": "GEMINI_API_KEY environment variable is missing."}
            )
            
        client = genai.Client(api_key=api_key)
        
        prompt = (
            f"You are an expert film location scout. Provide 3 specific shooting location recommendations "
            f"in or around {city} for a daily budget of {budget}.\n\n"
            f"You MUST return strictly a valid JSON array of objects with NO extra markdown formatting or backticks. "
            f"Each object must contain these exact keys:\n"
            f"- name: Location Name\n"
            f"- category: Visual style tag (e.g., 'Dramatic Nature', 'Modern Architecture', 'Waterfront')\n"
            f"- aesthetic: Description of vibe/aesthetic\n"
            f"- estimated_cost: Cost range string (e.g. '₦100,000 – ₦150,000 / day')\n"
            f"- logistics: Critical logistics notes\n"
            f"- image_keyword: A single search keyword suitable for an architectural/cinematic photo (e.g., 'quarry', 'art-gallery', 'reservoir')"
        )
        
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
        )
        
        raw_text = response.text.strip()
        if raw_text.startswith("```"):
            raw_text = raw_text.split("```")[1]
            if raw_text.startswith("json"):
                raw_text = raw_text[4:]
        raw_text = raw_text.strip()
        
        locations = json.loads(raw_text)
        
        # Attach high-quality photography URLs based on keyword
        for loc in locations:
            kw = loc.get("image_keyword", "architecture")
            loc["image_url"] = f"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
            if "quarry" in kw.lower() or "rock" in kw.lower():
                loc["image_url"] = "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=800&q=80"
            elif "gallery" in kw.lower() or "art" in kw.lower() or "modern" in kw.lower():
                loc["image_url"] = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
            elif "dam" in kw.lower() or "water" in kw.lower() or "lake" in kw.lower():
                loc["image_url"] = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
        
        return {
            "status": "success",
            "city": city,
            "budget": budget,
            "locations": locations
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )
