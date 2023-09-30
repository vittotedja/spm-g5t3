from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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

class Application(BaseModel):
    application_id: int
    status: str
    statement: str = None

@app.put("/api/update_application")
@router.put("/api/update_application")
async def update_application(application: Application):
    update_data = {'status': application.status}
    
    if application.statement:
        update_data['statement'] = application.statement

    update = supabase.from_('application').update(update_data).eq('application_id', application.application_id).execute().data
    return application