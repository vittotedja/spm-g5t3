from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from supabase import create_client, Client
from api.get_role import get_role


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
    role_ids = (
        supabase.from_("role_manager")
        .select("role_id")
        .eq("manager_id", manager_id)
        .execute()
        .data
    )
    roles = []
    for role_id in role_ids:
        role = await get_role(role_id["role_id"])
        no_of_applicant = (
            supabase.from_("application")
            .select("*")
            .eq("role_id", role_id["role_id"])
            .execute()
            .data
        )
        role[0]["no_of_applicants"] = len(no_of_applicant)
        roles.append(role[0])

    return roles
