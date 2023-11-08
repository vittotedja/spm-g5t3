from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from postgrest import exceptions

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


@app.get("/api/staff_skill")
@router.get("/api/staff_skill")
async def staff_skill(staff_id: int):
    try:
        staff_skill = pd.DataFrame.from_dict(
            supabase.from_("staff_skill")
            .select("skill(*)")
            .eq("staff_id", staff_id)
            .execute()
            .data
        )["skill"]
        return staff_skill.to_list()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Staff ID {staff_id} is invalid")