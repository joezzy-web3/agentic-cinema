import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from google import genai

app = FastAPI(title="Agentic Cinema API")

# Configure CORS
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
        
        # Initialize Google GenAI client
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return {
                "status": "warning",
                "message": "GEMINI_API_KEY environment variable is not set on Render.",
                "city": city,
                "budget": budget
            }
            
        client = genai.Client(api_key=api_key)
        
        prompt = (
            f"You are an expert film location scout. Provide 3 specific shooting location recommendations "
            f"in or around {city} for a movie production. The daily location budget is {budget}. "
            f"For each location, include: 1. Location Name, 2. Visual Aesthetic/Vibe, 3. Estimated Permitting/Rental Cost, 4. Logistics Note."
        )
        
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
        )
        
        return {
            "status": "success",
            "city": city,
            "budget": budget,
            "recommendations": response.text
        }

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": str(e)}
        )
