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


    
#get total applications of a staff for validation
@app.get("/api/totalapplications")
@router.get("/api/totalapplications")

async def get_totalapplications(staffid: int = None, roleid: int = None):
    if staffid:
        response = supabase.from_("application").select("*").eq("staff_id", str(staffid)).execute()
        applications = response.data
        num_applications = len(applications)
        response2 = supabase.from_("application").select("*").eq("staff_id", str(staffid)).eq('role_id', roleid).execute()
        haveapplied = response2.data

        if len(haveapplied) > 0:
            return {"total_applications": num_applications, "have_applied": True}
        else:
            return {"total_applications": num_applications, "have_applied": False}
    else:
        return {"error": "Staff ID is required."}
