from fastapi import FastAPI, APIRouter, Body
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from supabase import create_client, Client
from pydantic import BaseModel
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


class PostListingManager(BaseModel):
    manager_id: int
    listing_id: int


@app.get("/api/listing_manager")
@router.get("/api/listing_manager")
async def listing_manager(manager_id: int = None):
    if manager_id:
        listing = (
            supabase.from_("listing_manager")
            .select("listing_id", "listing(*, role(*))")
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
        data, count = (
            supabase.from_("listing_manager").insert(listing_manager.dict()).execute()
        )
        return {"success": True, "data": data[1][0]}
    except Exception as e:
        return {"success": False, "error": e}
