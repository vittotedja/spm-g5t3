from fastapi import FastAPI, APIRouter, HTTPException
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


@app.get("/api/skill")
@router.get("/api/skill")
async def skill(skill_id: int = None):
    if skill_id:
        skill = supabase.from_("skill").select("*").eq("skill_id", skill_id).execute().data
        if not skill:
            raise HTTPException(status_code=404, detail="Skill not found with the provided skill_id.")
        return skill
    else:
        skill = supabase.from_("skill").select("*").execute().data
        return skill
    
