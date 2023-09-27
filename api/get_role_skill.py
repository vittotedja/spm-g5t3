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

@app.get("/api/get_role_skill")
@router.get("/api/get_role_skill")
async def get_role_skill(role_id: int):
    role_skill_id = supabase.from_('role_skill').select("skill_id").eq('role_id', role_id).execute().data
    role_skill_id = [skill['skill_id'] for skill in role_skill_id]

    role_skill = supabase.from_('skill').select("*").in_('skill_id', role_skill_id).execute().data
    return role_skill