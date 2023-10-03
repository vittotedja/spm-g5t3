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

@app.get("/api/get_all_region")
@router.get("/api/get_all_region")
async def get_all_region():
    locations = supabase.from_('role').select("location").execute().data
    df = pd.DataFrame(locations)
    df = df.dropna(subset=['location'])
    unique_region_names = df['location'].drop_duplicates().sort_values().tolist()
    return unique_region_names