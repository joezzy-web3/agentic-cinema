import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Agentic Cinema API")

# Enable CORS for Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScoutRequest(BaseModel):
    query: str

@app.get("/")
def read_root():
    return {"status": "Agentic Cinema Backend active"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/scout")
async def scout_location(request: ScoutRequest):
    return {
        "query": request.query,
        "status": "success",
        "message": f"Scouting location for: {request.query}"
    }
