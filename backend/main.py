import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="Agentic Cinema API")

# Allow all origins, methods, and headers
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
        query = data.get("query", "Default Location")
    except Exception:
        query = "Location request received"

    return {
        "status": "success",
        "query": query,
        "message": f"Location scout analysis complete for: {query}"
    }
