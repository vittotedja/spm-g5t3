from fastapi import FastAPI, APIRouter, Body
from fastapi.middleware.cors import CORSMiddleware

import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client
from pydantic import BaseModel
from datetime import datetime
import pytz


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


class PostListing(BaseModel):
    role_id: int
    creation_date: datetime = None
    application_close_date: datetime


@app.get("/api/listing")
@router.get("/api/listing")
async def listing(listing_id: int = None):
    if listing_id:
        listing = (
            supabase.from_("listing")
            .select(
                "listing_id",
                "application_close_date",
                "role_id",
                "vacancy",
                "listing_location",
                "creation_date",
                "role(*), application(*)",
            )
            .eq("listing_id", listing_id)
            .execute()
            .data
        )
        return listing
    else:
        listing = supabase.from_("listing").select("*").execute().data
        return listing


@app.post("/api/listing")
@router.post("/api/listing")
async def listing(listing: PostListing = Body(...)):
    post = listing.dict()
    post["creation_date"] = datetime.now(pytz.utc).strftime("%Y-%m-%d %H:%M:%S")
    post["application_close_date"] = post["application_close_date"].strftime(
        "%Y-%m-%d %H:%M:%S"
    )
    try:
        data, count = supabase.table("listing").insert(post).execute()
        return {"success": True, "data": data[1][0]}
    except Exception as e:
        return {"success": False, "error": e}
