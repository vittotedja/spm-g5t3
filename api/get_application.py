from fastapi import FastAPI, APIRouter, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os
from dotenv import load_dotenv
from supabase import create_client, Client

from datetime import datetime

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

class NewApplication(BaseModel):
    application_id: int
    staff_id: int
    role_id: int
    status: str = "Pending"
    statement: str
    
class UpdateApplication(BaseModel):
    application_id: int
    status: str

@app.get("/api/get_application")
@router.get("/api/get_application")
async def get_application(application_id: int = None, staff_id: int = None):
    if application_id:
        application = supabase.from_('application').select("*").eq('application_id', application_id).execute().data
        return application
    elif staff_id:
        application = supabase.table('application').select('*, role(*)').eq('staff_id', staff_id).execute().data
        return application
    else:
        raise HTTPException(status_code=400, detail="Either application_id or staff_id must be provided.")

@app.post("/api/get_application")
@router.post("/api/get_application")
async def post_application(application: NewApplication = Body(...)):
    
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

@app.put("/api/get_application")
@router.put("/api/get_application")
async def update_application(application: UpdateApplication):
    update_data = {
        'status': application.status,
        'updated_at': datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    }

    update = supabase.from_('application').update(update_data).eq('application_id', application.application_id).execute().data
    return update