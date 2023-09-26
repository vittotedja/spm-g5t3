from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from endpoints import get_staff, get_role

import os
from dotenv import load_dotenv
from supabase import create_client, Client

import pandas as pd

load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(get_staff.router)
app.include_router(get_role.router)

@app.get("/api/main")
async def main():
    return {"message": "Hello World"}