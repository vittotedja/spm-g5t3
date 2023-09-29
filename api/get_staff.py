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

from api.get_role import get_role


@app.get("/api/get_staff")
@router.get("/api/get_staff")
async def get_staff(staff_id: int = 0):
    # TO GET ALL STUFF USE staff_id = 0
    if staff_id == 0:
        staff = supabase.from_("staff").select("*").execute().data
    else:
        staff = (
            supabase.from_("staff").select("*").eq("staff_id", staff_id).execute().data
        )
    return staff
