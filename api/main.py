from fastapi import FastAPI
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

@app.get("/api/main") 
async def main():
    return {"message": "Hello World"}   

@app.get("/api/staff")
async def get_staff(staff_id: int):
    staff = supabase.from_('staff').select("*").eq('staff_id', staff_id).execute().data[0]
    return staff

@app.get("/api/staff_skill")
async def get_staff_skill(staff_id: int):
    staff_skill_id = supabase.from_('staff_skill').select("skill_id").eq('staff_id', staff_id).execute().data
    staff_skill_id = [skill['skill_id'] for skill in staff_skill_id]

    staff_skill = supabase.from_('skill').select("*").in_('skill_id', staff_skill_id).execute().data
    return staff_skill

@app.get("/api/staff_role_skill")
async def get_staff_role_skill(staff_id: int, role_id: int):
    staff_skill_id = await get_staff_skill(staff_id)
    staff_skill_id = [skill['skill_id'] for skill in staff_skill_id]

    role_skill_id = supabase.from_('role_skill').select("skill_id").eq('role_id', role_id).execute().data
    role_skill_id = [skill['skill_id'] for skill in role_skill_id]

    # Get the details of the staff_skill
    role_skill = supabase.from_('skill').select("*").in_('skill_id', role_skill_id).execute().data

    # Add a 'qualified' field to the staff_skill list
    for skill in role_skill:
        skill['qualified'] = skill['skill_id'] in staff_skill_id
    
    # Sort the staff_skill list based on the 'qualified' field
    role_skill = sorted(role_skill, key=lambda x: not x['qualified'])

    return role_skill