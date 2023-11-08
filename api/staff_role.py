from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime, timezone
import math
import json
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


@app.get("/api/staff_role")
@router.get("/api/staff_role")
async def staff_role(
    staff_id: int = None,
    page: int = 1,
    limit: int = 10,
    sort_field: str = "creation_date",
    order: str = "asc",
    filters: str = "{}",
):
    parsed_filters = json.loads(filters)
    if staff_id:
        offset = (page - 1) * limit
        all_skills = (
            supabase.table("skill").select("skill_id, skill_name").execute().data
        )
        df_skills = pd.DataFrame(all_skills)

        # Fetch all roles from the database
        all_roles_response = supabase.table("role").select("*").execute()
        df_all_roles = pd.DataFrame(all_roles_response.data or [])

        # Fetch all staff from the database
        all_staff_response = supabase.table("staff").select("*").execute()
        df_staff = pd.DataFrame(all_staff_response.data or [])

        # Fetch all listings from the database
        all_listings_response = supabase.table("listing").select("*").execute()
        df_all_listings = pd.DataFrame(all_listings_response.data or [])

        df_all_listings = df_all_listings[df_all_listings["deleted_at"].isnull()]

        # Fetch all role-skill associations
        all_role_skills_response = supabase.table("role_skill").select("*").execute()
        df_role_skills = pd.DataFrame(all_role_skills_response.data or [])

        if len(df_all_listings) == 0:
            return {
                "data": [],
                "pagination": {
                    "current_page": 0,
                    "total_pages": 0,
                    "limit": limit,
                    "total_records": 0,
                },
                "all_regions": [],
                "all_roles": [],
                "all_skills": [],
                "all_departments": [],
            }

        # Associate skills with roles
        df_all_roles["role_skill"] = df_all_roles["role_id"].apply(
            lambda x: df_role_skills[df_role_skills["role_id"] == x][
                "skill_id"
            ].tolist()
        )

        # Get applied roles for the user
        applied_roles_response = (
            supabase.table("application")
            .select("listing_id")
            .eq("staff_id", str(staff_id))
            .execute()
        )
        applied_listing_IDs = [
            app["listing_id"] for app in applied_roles_response.data or []
        ]

        # Filter out the applied roles
        df_unapplied_listings = df_all_listings[
            ~df_all_listings["listing_id"].isin(applied_listing_IDs)
        ]

        # Merge with roles
        df_unapplied_listings = pd.merge(
            df_unapplied_listings, df_all_roles, on="role_id", how="left"
        )
        today = datetime.utcnow().replace(tzinfo=timezone.utc)
        df_unapplied_listings["application_close_date_dt"] = pd.to_datetime(
            df_unapplied_listings["application_close_date"], errors="coerce", utc=True
        )
        roles_with_date = df_unapplied_listings[
            (df_unapplied_listings["application_close_date_dt"].notnull())
            & (df_unapplied_listings["application_close_date_dt"] >= today)
            & (~df_unapplied_listings["listing_id"].isin(applied_listing_IDs))
        ]
        df_unapplied_listings.drop("application_close_date_dt", axis=1, inplace=True)
        roles_without_date = df_unapplied_listings[
            (df_unapplied_listings["application_close_date"].isnull())
            & (~df_unapplied_listings["listing_id"].isin(applied_listing_IDs))
        ]
        if sort_field == "application_close_date":
            roles_with_date = roles_with_date.sort_values(
                by="application_close_date", ascending=(order != "desc")
            )
            all_unapplied_roles = pd.concat([roles_with_date, roles_without_date])
        else:
            all_unapplied_roles = pd.concat([roles_with_date, roles_without_date])
            if sort_field in ["creation_date", "application_close_date"]:
                all_unapplied_roles = all_unapplied_roles.sort_values(
                    by=sort_field, ascending=(order != "desc")
                )
            else:
                all_unapplied_roles = all_unapplied_roles.sort_values(
                    by=sort_field, ascending=(order != "desc")
                )
        # Fetch listings managed by the current staff
        listing_manager_response = (
            supabase.table("listing_manager")
            .select("*")
            .eq("manager_id", str(staff_id))
            .execute()
            .data
        )
        if len(listing_manager_response) > 0:
            df_current_staff = pd.DataFrame(listing_manager_response)
            managed_listing_ids = df_current_staff["listing_id"].tolist()
            all_unapplied_roles = all_unapplied_roles[
                ~all_unapplied_roles["listing_id"].isin(managed_listing_ids)
            ]

        df_exploded_filtered = all_unapplied_roles.explode("role_skill")
        df_merged_filtered = pd.merge(
            df_exploded_filtered,
            df_skills,
            left_on="role_skill",
            right_on="skill_id",
            how="inner",
        )
        unique_skills = (
            df_merged_filtered["skill_name"].drop_duplicates().sort_values().tolist()
        )

        unique_role_names = (
            df_merged_filtered["role_name"]
            .dropna()
            .drop_duplicates()
            .sort_values()
            .tolist()
        )
        unique_departments = (
            df_merged_filtered["role_department"]
            .dropna()
            .drop_duplicates()
            .sort_values()
            .tolist()
        )
        unique_regions = (
            df_merged_filtered["listing_location"]
            .dropna()
            .drop_duplicates()
            .sort_values()
            .tolist()
        )

        # Apply Filters Directly on the Merged DataFrame
        if "Skills" in parsed_filters and parsed_filters["Skills"]:
            skill_name_filters = parsed_filters["Skills"]
            matching_skill_ids = df_skills[
                df_skills["skill_name"].isin(skill_name_filters)
            ]["skill_id"].tolist()
            all_unapplied_roles = all_unapplied_roles[
                all_unapplied_roles["role_skill"].apply(
                    lambda x: any(skill_id in matching_skill_ids for skill_id in x)
                )
            ]

        if "Role Name" in parsed_filters and parsed_filters["Role Name"]:
            role_name_filters = parsed_filters["Role Name"]
            all_unapplied_roles = all_unapplied_roles[
                all_unapplied_roles["role_name"].isin(role_name_filters)
            ]

        if "Department" in parsed_filters and parsed_filters["Department"]:
            department_filters = parsed_filters["Department"]
            all_unapplied_roles = all_unapplied_roles[
                all_unapplied_roles["role_department"].isin(department_filters)
            ]

        if "Region" in parsed_filters and parsed_filters["Region"]:
            region_filters = parsed_filters["Region"]
            all_unapplied_roles = all_unapplied_roles[
                all_unapplied_roles["listing_location"].isin(region_filters)
            ]

        unapplied_roles_df = all_unapplied_roles.iloc[offset : offset + limit]
        unapplied_roles_df = unapplied_roles_df.fillna(value="")
        unapplied_roles = unapplied_roles_df.to_dict("records")
        staff_skill_response = (
            supabase.table("staff_skill")
            .select("skill_id")
            .eq("staff_id", str(staff_id))
            .execute()
        )
        staff_skill_ids_set = set(
            skill["skill_id"] for skill in staff_skill_response.data or []
        )
        for role in unapplied_roles:
            role_skill_id_set = {skill for skill in role.get("role_skill", [])}
            matched_skills = staff_skill_ids_set.intersection(role_skill_id_set)
            percentage_match = (
                (len(matched_skills) / len(role_skill_id_set)) * 100
                if role_skill_id_set
                else 0
            )
            role["percentage_match"] = percentage_match

        total_roles = len(all_unapplied_roles)
        total_pages = math.ceil(total_roles / limit)
        return {
            "data": unapplied_roles,
            "pagination": {
                "current_page": page,
                "total_pages": total_pages,
                "limit": limit,
                "total_records": total_roles,
            },
            "all_regions": unique_regions,
            "all_roles": unique_role_names,
            "all_skills": unique_skills,
            "all_departments": unique_departments,
        }
    else:
        result = supabase.table("role").select("*").execute()
        return {"data": result.data or []}


def parse_datetime(datetime_str):
    formats = [
        "%Y-%m-%dT%H:%M:%S.%f%z",  # With fractional seconds
        "%Y-%m-%dT%H:%M:%S%z",
        "%Y-%m-%d %H:%M:%S%z",  # Without fractional seconds
    ]

    for fmt in formats:
        try:
            return datetime.strptime(datetime_str, fmt)
        except ValueError:
            continue

    raise ValueError(f"time data {datetime_str!r} does not match any known formats")


def fetch_all_skill():
    skills = supabase.from_("skill").select("skill_name").execute().data
    df = pd.DataFrame(skills)
    return df["skill_name"].drop_duplicates().sort_values().tolist()
