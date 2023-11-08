from fastapi import FastAPI, APIRouter, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware

import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client
from pydantic import BaseModel
from datetime import datetime
import pytz
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
    role_id: int
    listing_location: str
    vacancy: int
    creation_date: datetime = None
    application_close_date: datetime


class PutListing(BaseModel):
    application_close_date: datetime
    vacancy: int
    manager: list
    listing_id: int


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
                "role(*), application(*), listing_manager(staff(*))",
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
    post["creation_date"] = datetime.now(pytz.utc).strftime("%Y-%m-%dT%H:%M:%S.%f%z")
    print(post["application_close_date"])
    post["application_close_date"] = post["application_close_date"].strftime(
        "%Y-%m-%d %H:%M:%S.%f%z"
    )
    print(post["application_close_date"])
    try:
        data, count = supabase.table("listing").insert(post).execute()
        return {"success": True, "data": data[1][0]}
    except Exception as e:
        raise HTTPException(
            status_code=400, detail={"success": False, "data": e.json()}
        )


def custom_strftime(dt: datetime) -> str:
    # Format the datetime without the timezone
    dt_str = dt.strftime("%Y-%m-%dT%H:%M:%S.%f")

    # Add the timezone manually in the +00:00 format
    tz_str = (
        f"{dt.utcoffset().seconds // 3600:02}:{(dt.utcoffset().seconds // 60) % 60:02}"
    )

    return f"{dt_str}{tz_str}"

@app.put("/api/listing")
@router.put("/api/listing")
async def listing(listing: PutListing):
    update_data = {
        "application_close_date": listing.application_close_date.strftime(
        "%Y-%m-%d %H:%M:%S"
        ),
        "vacancy": listing.vacancy,
        "updated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
    }

    listing_update = (
        supabase.from_("listing")
        .update(update_data)
        .eq("listing_id", listing.listing_id)
        .execute()
        .data
    )
    if listing_update:
         pass
    else:
        raise HTTPException(
            status_code=400, 
            detail=f'Listing ID {listing.listing_id} is not found'
        )

    # update listing manager
    manager = pd.DataFrame(
        supabase.table("listing_manager")
        .select("*")
        .eq("listing_id", listing.listing_id)
        .execute()
        .data
    )
    listing_id = listing.listing_id
    new_manager = pd.DataFrame(listing.manager)
    new_manager['listing_id'] = listing_id
    new_manager.rename(columns={'value': 'manager_id'}, inplace=True)

    #add listing manager
    add_manager = new_manager[~new_manager["manager_id"].isin(manager["manager_id"])]
    if len(add_manager) > 0:
        add_manager = add_manager[["listing_id", "manager_id"]].to_dict(orient='records')
        adding_manager = (
            supabase.from_("listing_manager")
            .upsert(add_manager)
            .execute()
            .data
        )
        if adding_manager:
            pass
        else:
            raise HTTPException(
                status_code=400, 
                detail=f'Unable to add the hiring managers.'
            )
    else:
        adding_manager = []
    
    #delete listing manager
    delete_manager = manager[~manager["manager_id"].isin(new_manager["manager_id"])]
    if len(delete_manager) > 0:
        delete_manager = delete_manager[['listing_id', 'manager_id']].to_dict(orient='records')
        for del_man in delete_manager:
            deleting_manager = (
                supabase.table("listing_manager")
                .delete()
                .eq("listing_id", del_man["listing_id"])
                .eq("manager_id", del_man["manager_id"])
                .execute()
                .data
            )
            if deleting_manager:
                pass
            else:
                raise HTTPException(
                    status_code=400, 
                    detail=f'Hiring manager with manager ID {del_man["manager_id"]} is not found.'
                )
    else:
        deleting_manager = []
    return listing_update, adding_manager, deleting_manager