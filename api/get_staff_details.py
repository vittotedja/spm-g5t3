from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from supabase import create_client, Client

import pandas as pd

load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
router = APIRouter()

@app.get("/api/get_staff_details")
@router.get("/api/get_staff_details")
async def get_staff_details(email: str):
    staff_id = supabase.from_('staff').select("*").eq('email', email).execute().data
    return staff_id