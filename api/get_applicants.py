import math
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = FastAPI(swagger_ui_parameters={"displayRequestDuration": True})

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
router = APIRouter()



@app.get("/api/applicants")
@router.get("/api/applicants")
async def get_applicants(roleid: int = None):
    if roleid:
        response = supabase.from_("application").select("staff_id", "status").eq("role_id", str(roleid)).execute()
        data = response.data
        
        staffid = [entry["staff_id"] for entry in data]
        statuses = [entry["status"] for entry in data]

        staffs = []

        roleskillsidsdata = supabase.from_("role_skill").select("skill_id").eq("role_id", str(roleid)).execute()
        role_skills = roleskillsidsdata.data
        roleskillsids = {role_skills['skill_id'] for role_skills in role_skills}

        for i in range(len(staffid)):
            staffskillsidsdata = supabase.from_("staff_skill").select("skill_id").eq("staff_id", str(staffid[i])).execute()
            staff_skills = staffskillsidsdata.data
            staffskillids = {staff_skill['skill_id'] for staff_skill in staff_skills}

            matched_skills = staffskillids.intersection(roleskillsids)
            percentage_match = (len(matched_skills) / len(roleskillsids)) * 100

            staffresponse = supabase.from_("staff").select("*").eq("staff_id", str(staffid[i])).execute()
            skill_data = staffresponse.data

            if skill_data:
                staff_entry = {
                    "status": statuses[i],
                    "staff": skill_data[0],
                    "percentage_match": percentage_match
                }
                staffs.append(staff_entry)
        
        
        return {"data": staffs}
    else:
        return {"error": "."}
