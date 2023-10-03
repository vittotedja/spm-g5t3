from fastapi import FastAPI, APIRouter
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

@app.get("/api/get_all_skill")
@router.get("/api/get_all_skill")
async def get_all_skill():
    skills = supabase.from_('skill').select("skill_name").execute().data
    df = pd.DataFrame(skills)
    unique_skill_names = df['skill_name'].drop_duplicates().sort_values().tolist()
    return unique_skill_names