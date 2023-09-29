from fastapi import FastAPI, APIRouter
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

router = APIRouter()

@app.get("/api/get_staff_application")
@router.get("/api/get_staff_application")
async def get_staff_application(staff_id: int):
    staff_application = supabase.from_("application").select("*").eq("staff_id", staff_id).execute().data
    role_table = supabase.from_("role").select("*").execute().data
    role_id = []
    for appl in staff_application:
        role_id.append(appl["role_id"])
    role_name = []
    for role in role_table:
        if role["role_id"] in role_id:
            role_name.append(role)
    return role_name