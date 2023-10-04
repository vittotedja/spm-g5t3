from fastapi import FastAPI, APIRouter, HTTPException
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
async def get_staff(email: str = None, staff_id: int = None):
    if email:
        staff_data = supabase.from_('staff').select("*").eq('email', email).execute().data
        if not staff_data:
            raise HTTPException(status_code=404, detail="Staff not found with the provided email.")
        return staff_data[0]
    elif staff_id:
        if staff_id == 0:
            staff = supabase.from_("staff").select("*").execute().data
            return staff
        staff_data = supabase.from_('staff').select("*").eq('staff_id', staff_id).execute().data
        if not staff_data:
            raise HTTPException(status_code=404, detail="Staff not found with the provided staff_id.")
        return staff_data[0]
    else:
        raise HTTPException(status_code=400, detail="Either email or staff_id must be provided.")
