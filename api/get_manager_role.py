from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from supabase import create_client, Client
from api.get_role import get_role

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


@app.get("/api/get_manager_role")
@router.get("/api/get_manager_role")
async def get_manager_role(manager_id: int):
    roles = (
        supabase.from_("role_manager")
        .select("role_id", "role(*)")
        .eq("manager_id", manager_id)
        .execute()
        .data
    )

    for role in roles:
        no_of_applicant = (
            supabase.from_("application")
            .select("*")
            .eq("role_id", role["role_id"])
            .execute()
            .data
        )
        role["role"]["no_of_applicants"] = len(no_of_applicant)
    return roles
