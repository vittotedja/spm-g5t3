from fastapi import APIRouter

import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

router = APIRouter()

from .get_role import get_role
@router.get("/api/get_staff")
async def get_staff(staff_id: int):
    staff = supabase.from_('staff').select("*").eq('staff_id', staff_id).execute().data[0]
    print(await get_role(role_id=1))
    return await get_role(role_id=1)