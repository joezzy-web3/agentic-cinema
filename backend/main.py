from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and mount existing routes/code below...
