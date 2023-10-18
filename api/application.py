from fastapi import FastAPI, APIRouter, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from enum import Enum

import os
from dotenv import load_dotenv
from supabase import create_client, Client

from datetime import datetime

import pandas as pd

from api.staff_role_skill import staff_role_skill

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

class TimestampzConverter(BaseModel):
    rootmodel: datetime
    def __get__(self, obj, type=None):
        return super().__get__(obj, type).isoformat()

class ApplicationStatus(str, Enum):
    Applied = "Applied"
    Shortlisted = "Shortlisted"
    Rejected = "Rejected"
    Withdrawn = "Withdrawn"

class PostApplication(BaseModel):
    application_id: int
    staff_id: int
    listing_id: int
    application_status: ApplicationStatus = "Applied"
    application_reason: str
    
class PutApplication(BaseModel):
    application_id: int
    application_status: ApplicationStatus

@app.get("/api/application")
@router.get("/api/application")
async def application(application_id: int = None, staff_id: int = None, role_id: int = None):
    if staff_id and role_id:
        application = supabase.from_('application').select("*").eq('staff_id', staff_id).eq('listing_id', role_id).execute().data
        return application
    elif application_id:
        application = supabase.from_('application').select(
            "*",
            "listing(*, role(*))",
        ).eq('application_id', application_id).execute().data
        return application
    elif staff_id:
        application = supabase.table('application').select('*, listing(*)').eq('staff_id', staff_id).execute().data
        return application
    elif role_id:
        application = pd.DataFrame.from_records(supabase.table('application').select('*, staff(*)').eq('listing_id', role_id).execute().data)

        # get match percentage for each application
        match_percentage = [(await staff_role_skill(staff['staff_id'], role_id))['match_percentage'] for staff in application.staff]
        application['match_percentage'] = match_percentage

        return application.to_dict('records')
    else:
        raise HTTPException(status_code=400, detail="Either application_id, staff_id, or role_id must be provided.")

@app.post("/api/application")
@router.post("/api/application")
async def application(application: PostApplication = Body(...)):
    
    try:
        data, error = supabase.table('application').insert([
            application.dict()
        ]).execute()

        print(application.application_id)

        if error:
            print(error)  # Log the error for debugging
            return {"success": False, "error": error}
        else:
            return {"success": True, "data": data}  # Return the first item in the response

    
    except Exception as e:
        return {"success": False, "error": e}

@app.put("/api/application")
@router.put("/api/application")
async def application(application: PutApplication):
    update_data = {
        'application_status': application.application_status,
        'updated_at': datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    }

    update = supabase.from_('application').update(update_data).eq('application_id', application.application_id).execute().data
    return update