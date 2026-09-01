import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from agent import run_agentic_scout, LocationSearchResult

app = FastAPI(title="Agentic Location Scout API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Agentic Cinema Backend Running"}

@app.post("/scout", response_model=LocationSearchResult)
async def scout_location(
    file: UploadFile = File(...),
    city: str = Form("Lagos"),
    budget: str = Form("₦200,000 per day")
):
    try:
        image_bytes = await file.read()
        mime_type = file.content_type or "image/jpeg"
        
        result = await run_agentic_scout(
            image_bytes=image_bytes,
            image_mime=mime_type,
            city=city,
            budget=budget
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
