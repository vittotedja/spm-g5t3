from fastapi import FastAPI, APIRouter, Body
from fastapi.middleware.cors import CORSMiddleware
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel, Field

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

from datetime import datetime, timezone

class TimestampzConverter(BaseModel):
    rootmodel: datetime
    def __get__(self, obj, type=None):
        return super().__get__(obj, type).isoformat()

class Application(BaseModel):
    application_id: int
    staff_id: int
    role_id: int
    status: str = "Pending"
    statement: str

@app.post("/api/post_application")
@router.post("/api/post_application")
async def post_application(application: Application = Body(...)):
    
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
