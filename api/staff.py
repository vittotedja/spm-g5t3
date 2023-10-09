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


@app.get("/api/staff")
@router.get("/api/staff")
async def staff(email: str = None, staff_id: int = None):
    if email:
        staff = supabase.from_("staff").select("*").eq("email", email).execute().data
        if not staff:
            raise HTTPException(
                status_code=404, detail="Staff not found with the provided email."
            )
        return staff
    elif staff_id:
        if staff_id == 0:
            staff = supabase.from_("staff").select("*").execute().data
            return staff
        staff = (
            supabase.from_("staff").select("*").eq("staff_id", staff_id).execute().data
        )
        if not staff:
            raise HTTPException(
                status_code=404, detail="Staff not found with the provided staff_id."
            )
        return staff
    else:
        staff = supabase.from_("staff").select("*").execute().data
        return staff
