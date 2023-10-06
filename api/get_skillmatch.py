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

@app.get("/api/get_skillmatch")
@router.get("/api/get_skillmatch")
async def get_skillmatch(roleid: int = None, staffid: int = None):
    if roleid and staffid:
        try:
            roleskillid_response = supabase.from_("role_skill").select("skill_id").eq("role_id", str(roleid)).execute()
            roleskillid = roleskillid_response.data if roleskillid_response.data else []

            roleskillid = [entry["skill_id"] for entry in roleskillid]

            roleskillname = []
            for skill_id in roleskillid:
                skill_response = supabase.from_("skill").select("skill_name").eq("skill_id", str(skill_id)).execute()
                skill_data = skill_response.data if skill_response.data else []

                if skill_data:
                    roleskillname.append(skill_data[0]["skill_name"])

            staffskillid_response = supabase.from_("staff_skill").select("skill_id").eq("staff_id", str(staffid)).execute()
            staffskillid = staffskillid_response.data if staffskillid_response.data else []
            staffskillid = [entry["skill_id"] for entry in staffskillid]

            staffskillname = []
            for skill_id in staffskillid:
                skill_response = supabase.from_("skill").select("skill_name").eq("skill_id", str(skill_id)).execute()
                skill_data = skill_response.data if skill_response.data else []

                if skill_data:
                    staffskillname.append(skill_data[0]["skill_name"])

            inbothskill = []
            onlyinroleskill = []
            count = 0

            for role in roleskillname:
                if role in staffskillname:
                    inbothskill.append(role)
                    count += 1
                else:
                    onlyinroleskill.append(role)

            percentage = round(count / len(roleskillname) * 100)

            return {
                
                    "In_Both": inbothskill,
                    "Only_In_Roles": onlyinroleskill,
                    "percentage": percentage
                
            }
        except Exception as e:
            return {"error": str(e)}
    else:
        result = supabase.from_("role").select().execute()
        if 'error' in result:
            return {"error": result.error.message if result.error.message else "Failed to fetch data from Supabase"}

        return {"data": result.data if result.data else []}
