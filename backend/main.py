cat << 'EOF' > backend/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Agentic Cinema API")

# Enable CORS for Vercel frontend
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
    return {"status": "Agentic Cinema Backend is running successfully"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/scout")
async def scout_location(request: ScoutRequest):
    # Retrieve environment variables configured in Render
    gemini_key = os.getenv("GEMINI_API_KEY")
    parallel_key = os.getenv("PARALLEL_API_KEY")
    
    return {
        "query": request.query,
        "message": f"Location scout pipeline initialized for query: {request.query}",
        "keys_configured": bool(gemini_key and parallel_key)
    }
EOF
