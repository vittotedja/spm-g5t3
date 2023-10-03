from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from supabase import create_client, Client

from api.get_staff_skill import get_staff_skill
from api.get_role_skill import get_role_skill

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

@app.get("/api/get_staff_role_skill")
@router.get("/api/get_staff_role_skill")
async def get_staff_role_skill(staff_id: int, role_id: int):
    # Get the list of skill_id for the staff and role
    staff_skill = pd.DataFrame.from_dict(await get_staff_skill(staff_id))
    role_skill = pd.DataFrame.from_dict(await get_role_skill(role_id))
    
    # Add a 'qualified' field to the staff_skill list
    if not staff_skill.empty:
        role_skill['qualified'] = role_skill['skill_id'].isin(staff_skill['skill_id'])
    else:
        role_skill['qualified'] = False 

    # Sort the staff_skill list based on the 'qualified' field
    staff_role_skill = role_skill.sort_values(by=['qualified', 'skill_name'], ascending=[False, True])

    return staff_role_skill.to_dict('records')