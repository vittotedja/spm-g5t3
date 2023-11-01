from fastapi import FastAPI, APIRouter, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from supabase import create_client, Client
from pydantic import BaseModel

from postgrest import exceptions

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


class PostListingManager(BaseModel):
    manager_id: int
    listing_id: int


@app.get("/api/listing_manager")
@router.get("/api/listing_manager")
async def listing_manager(manager_id: int = None):
    if manager_id:
        listing = (
            supabase.from_("listing_manager")
            .select("listing_id", "listing(*)")
            .eq("manager_id", manager_id)
            .execute()
            .data
        )
        return listing
    else:
        listing = supabase.from_("listing_manager").select("*").execute().data
        return listing


@app.post("/api/listing_manager")
@router.post("/api/listing_manager")
async def listing_manager(listing_manager: PostListingManager = Body(...)):
    try:
        response = supabase.from_("listing_manager").insert(listing_manager.dict()).execute().data
        return {
            "success": True, 
            "data": response[0]
        }
    except exceptions.APIError as e:
        raise HTTPException(
            status_code = 400, 
            detail = {
                "success": False,
                "data": e.json()
            }
        )
