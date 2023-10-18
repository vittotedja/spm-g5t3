from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from supabase import create_client, Client

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

@app.get("/api/get_staff_skill")
@router.get("/api/get_staff_skill")
async def get_staff_skill(staff_id: int):
    staff_skill_id = supabase.from_('staff_skill').select("skill_id").eq('staff_id', staff_id).execute().data
    staff_skill_id = [skill['skill_id'] for skill in staff_skill_id]

    staff_skill = supabase.from_('skill').select("*").in_('skill_id', staff_skill_id).execute().data
    return staff_skill