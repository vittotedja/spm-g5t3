from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from supabase import create_client, Client

from api.staff_skill import staff_skill

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


@app.get("/api/staff_role_skill")
@router.get("/api/staff_role_skill")
async def staff_role_skill(staff_id: int = None, role_id: int = None):
    if staff_id and role_id:
        # Get the list of skill_id for the staff and role
        staff_skills = pd.DataFrame.from_dict(await staff_skill(staff_id))
        role_skills = pd.DataFrame.from_records(
            pd.DataFrame.from_dict(
                supabase.from_("role_skill")
                .select("skill(*)")
                .eq("role_id", role_id)
                .execute()
                .data
            )["skill"]
        )

        # Add a 'qualified' field to the staff_skill list
        role_skills["qualified"] = role_skills["skill_id"].isin(
            staff_skills["skill_id"]
        )

        # Sort the staff_skill list based on the 'qualified' field
        skill = role_skills.sort_values(
            by=["qualified", "skill_name"], ascending=[False, True]
        )
        match_percentage = skill["qualified"].mean() * 100
        skill = skill.to_dict("records")

        staff_role_skill = {"match_percentage": match_percentage, "skill": skill}

        return staff_role_skill
    elif not staff_id and role_id:
        role_skills = (
            supabase.from_("role_skill")
            .select("*")
            .eq("role_id", role_id)
            .execute()
            .data
        )
        return role_skills
    else:
        role_skills = supabase.from_("role_skill").select("*").execute().data
        return role_skills
