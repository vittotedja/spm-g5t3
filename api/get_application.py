from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from supabase import create_client, Client

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

@app.get("/api/get_application")
@router.get("/api/get_application")
async def get_application(application_id: int):
    application = supabase.from_('application').select("*").eq('application_id', application_id).execute().data
    return application