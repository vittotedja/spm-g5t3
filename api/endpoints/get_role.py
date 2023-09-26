from fastapi import APIRouter

import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

router = APIRouter()

@router.get("/api/get_role")
async def get_role(role_id: int):
    staff = supabase.from_('role').select("*").eq('role_id', role_id).execute().data[0]
    return staff