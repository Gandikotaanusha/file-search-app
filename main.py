from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import search, upload

app = FastAPI()

# Allow Next.js frontend
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # allow Next.js origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search.router, prefix="/api/search")
app.include_router(upload.router, prefix="/api/upload")
