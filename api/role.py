from fastapi import FastAPI, APIRouter, HTTPException
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

#view a single role details
@app.get("/api/role")
@router.get("/api/role")
async def role(role_id: int = None):
    if role_id:
        role = supabase.from_("role").select("*").eq("role_id", str(role_id)).execute().data
        if not role:
            raise HTTPException(status_code=404, detail="Role not found with the provided role_id.")
        return role
    else:
        role = supabase.from_("role").select("*").execute().data
        return role