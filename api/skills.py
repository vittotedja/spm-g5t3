import math
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from supabase import create_client, Client
from dotenv import load_dotenv

import pandas as pd
# Load environment variables from .env file
load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = FastAPI(swagger_ui_parameters={"displayRequestDuration": True})

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/skills")
async def get_skills(staff_id: int):
    staff_skill = supabase.from_("staff_skill").select("*").eq("staff_id", staff_id).execute().data
    skill_table = supabase.from_("skill").select("*").execute().data
    sk_id = []
    for sk in staff_skill:
        sk_id.append(sk["skill_id"])
    skill_name = []
    for skill in skill_table:
        if skill["skill_id"] in sk_id:
            skill_name.append(skill)
    return skill_name