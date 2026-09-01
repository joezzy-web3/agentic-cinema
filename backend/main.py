import asyncio
import logging
import os
from contextlib import asynccontextmanager
from typing import List, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from pydantic import BaseModel, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("agentic_cinema")


# --------------------------------------------------------------------------
# Config
# --------------------------------------------------------------------------
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    gemini_api_key: str
    gemini_model: str = "gemini-3.6-flash"
    allowed_origins: str = "*"
    request_timeout_seconds: float = 30.0

    @property
    def cors_origins(self) -> List[str]:
        if self.allowed_origins.strip() == "*":
            return ["*"]
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


settings = Settings()


# --------------------------------------------------------------------------
# Schemas
# --------------------------------------------------------------------------
CURRENCIES = Literal["USD", "EUR", "GBP", "NGN", "CAD", "AUD", "JPY", "AED"]


class ScoutRequest(BaseModel):
    query: str = Field(default="London", min_length=1, max_length=120)
    budget: str = Field(default="1500", max_length=20)
    currency: CURRENCIES = "USD"
    image_name: str | None = Field(default=None, max_length=200)

    @field_validator("query")
    @classmethod
    def strip_query(cls, v: str) -> str:
        cleaned = " ".join(v.split())
        if not cleaned:
            raise ValueError("query cannot be empty")
        return cleaned

    @field_validator("budget")
    @classmethod
    def validate_budget(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned.replace(".", "", 1).isdigit():
            raise ValueError("budget must be numeric")
        return cleaned


class GeneratedLocation(BaseModel):
    name: str
    category: str
    aesthetic: str
    estimated_cost: str
    logistics: str
    image_keyword: str


class GeneratedLocationResponse(BaseModel):
    locations: List[GeneratedLocation]


class LocationOut(BaseModel):
    name: str
    category: str
    aesthetic: str
    estimated_cost: str
    logistics: str
    image_url: str


class ScoutResponse(BaseModel):
    status: str
    city: str
    budget: str
    currency: str
    locations: List[LocationOut]


# --------------------------------------------------------------------------
# Image lookup
# --------------------------------------------------------------------------
IMAGE_BY_KEYWORD: dict[tuple[str, ...], str] = {
    ("quarry", "rock", "mountain"):
        "https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=1000&q=80",
    ("gallery", "art", "museum", "modern", "architecture"):
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    ("reservoir", "dam", "lake", "water", "beach"):
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
    ("park", "forest", "nature"):
        "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80",
    ("city", "street", "skyscraper", "alley"):
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
}
DEFAULT_IMAGE = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"


def resolve_image(image_keyword: str) -> str:
    kw = image_keyword.lower()
    for keywords, url in IMAGE_BY_KEYWORD.items():
        if any(k in kw for k in keywords):
            return url
    return DEFAULT_IMAGE


# --------------------------------------------------------------------------
# Gemini client initialization
# --------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.genai_client = genai.Client(api_key=settings.gemini_api_key)
    logger.info("Gemini client initialized (model=%s)", settings.gemini_model)
    yield


app = FastAPI(title="Agentic Cinema API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"status": "Agentic Cinema Backend active"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


def build_prompt(req: ScoutRequest) -> str:
    return (
        f"You are a global film location scout. Provide 6 real, specific shooting location "
        f"recommendations in or around '{req.query}' for a production with a daily location "
        f"permit budget of {req.currency} {req.budget}.\n"
        f"- Output realistic permit costs in the requested currency ({req.currency}) or local equivalent.\n"
        f"- Provide actionable logistics notes tailored to filming in '{req.query}' "
        f"(permits, access, power, acoustics).\n"
        f"- For image_keyword, provide a single English architectural/environmental keyword "
        f"(e.g., quarry, gallery, waterfront, cathedral, alleyway, skyscraper)."
    )


def call_gemini_sync(client: genai.Client, prompt: str) -> GeneratedLocationResponse:
    response = client.models.generate_content(
        model=settings.gemini_model,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=GeneratedLocationResponse,
        ),
    )
    return GeneratedLocationResponse.model_validate_json(response.text)


@app.post("/scout", response_model=ScoutResponse)
async def scout_location(req: ScoutRequest):
    client: genai.Client = app.state.genai_client
    prompt = build_prompt(req)

    try:
        parsed = await asyncio.wait_for(
            asyncio.to_thread(call_gemini_sync, client, prompt),
            timeout=settings.request_timeout_seconds,
        )
    except asyncio.TimeoutError:
        logger.warning("Gemini call timed out for query=%r", req.query)
        raise HTTPException(status_code=504, detail="Location scout timed out. Try again.")
    except Exception:
        logger.exception("Gemini call failed for query=%r", req.query)
        raise HTTPException(status_code=502, detail="Location scout is temporarily unavailable.")

    locations = [
        LocationOut(
            name=loc.name,
            category=loc.category,
            aesthetic=loc.aesthetic,
            estimated_cost=loc.estimated_cost,
            logistics=loc.logistics,
            image_url=resolve_image(loc.image_keyword),
        )
        for loc in parsed.locations
    ]

    return ScoutResponse(
        status="success",
        city=req.query,
        budget=req.budget,
        currency=req.currency,
        locations=locations,
    )
