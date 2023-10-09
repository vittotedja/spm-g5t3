from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from supabase import create_client, Client
from pydantic import BaseModel
from datetime import datetime


import pandas as pd

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
    listing_id: int
    role_id: int
    manager_id: int
    creation_date: datetime


@app.get("/api/manager_rolelisting")
@router.get("/api/manager_rolelisting")
async def manager_rolelisting(manager_id: int):
    role = (
        supabase.from_("listing")
        .select("role_id", "role(*), application(*)")
        .eq("manager_id", manager_id)
        .execute()
        .data
    )
    return role


@app.get("/api/listing")
@router.get("/api/listing")
async def listing(manager_id: int = None):
    if manager_id:
        listing = (
            supabase.from_("listing")
            .select("role_id", "role(*), application(*)")
            .eq("manager_id", manager_id)
            .execute()
            .data
        )
        return listing
    else:
        listing = supabase.from_("listing").select("*").execute().data


# @app.post("/api/listing")
# @router.post("/api/listing")
# async def listing(listing: ):
