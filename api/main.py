from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime, timezone

import math
import os
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


@app.get("/api/main")
async def root():
    return {"message": "Hello World"}


@app.get("/api/staff_role")
async def get_staff_role(userid: int = None, page: int = 1, limit: int = 5, sort_field: str = 'created_at', order: str = 'asc'):
    if userid:
        offset = (page - 1) * limit

        # Get applied roles
        applied_roles_response = supabase.table("application").select(
            "role_id").eq("staff_id", str(userid)).execute()
        applied_role_IDs = [role["role_id"]
                            for role in applied_roles_response.data or []]

        today = datetime.utcnow().replace(tzinfo=timezone.utc)

        # Get all roles and filter out the applied ones
        all_roles_response = supabase.table("role").select(
            "*, role_skill!role_skill_role_id_fkey(skill_id)").execute()

        # Separate roles with null appl_close_date and those with a valid date
        roles_with_date = [role for role in all_roles_response.data or [] if role["appl_close_date"] is not None and datetime.fromisoformat(role["appl_close_date"]) >= today and role["role_id"] not in applied_role_IDs]
        roles_without_date = [role for role in all_roles_response.data or [] if role["appl_close_date"] is None and role["role_id"] not in applied_role_IDs]

        if sort_field == 'appl_close_date':
            roles_with_date.sort(
                key=lambda x: x["appl_close_date"], reverse=(order == 'desc'))
            all_unapplied_roles = roles_with_date + roles_without_date
        else:
            all_unapplied_roles = roles_with_date + roles_without_date
            if sort_field in ['created_at', 'application_date']:
                all_unapplied_roles.sort(key=lambda x: parse_datetime(x.get(
                    sort_field, '') or '1900-01-01T00:00:00+00:00') if x.get(sort_field) else datetime.min, reverse=(order == 'desc'))
            else:  # For 'role_name' and 'dept'
                all_unapplied_roles.sort(key=lambda x: x.get(
                    sort_field, ''), reverse=(order == 'desc'))

        # Slice the sorted list for pagination
        unapplied_roles = all_unapplied_roles[offset:offset+limit]

        # Get staff skills once outside the loop
        staff_skill_response = supabase.table("staff_skill").select(
            "skill_id").eq("staff_id", str(userid)).execute()
        staff_skill_ids_set = set(skill['skill_id']
                                  for skill in staff_skill_response.data or [])

        for role in unapplied_roles:
            role_skill_ids_set = {skill['skill_id']
                                  for skill in role.get('role_skill', [])}
            matched_skills = staff_skill_ids_set.intersection(
                role_skill_ids_set)
            percentage_match = (
                len(matched_skills) / len(role_skill_ids_set)) * 100 if role_skill_ids_set else 0
            role["percentage_match"] = percentage_match

        total_roles = len(all_unapplied_roles)
        total_pages = math.ceil(total_roles / limit)

        return {
            "data": unapplied_roles,
            "pagination": {
                "current_page": page,
                "total_pages": total_pages,
                "limit": limit,
                "total_records": total_roles
            }
        }
    else:
        result = supabase.table("roles").select().execute()
        return {"data": result.data or []}


def parse_datetime(datetime_str):
    formats = [
        '%Y-%m-%dT%H:%M:%S.%f%z',  # With fractional seconds
        '%Y-%m-%dT%H:%M:%S%z'     # Without fractional seconds
    ]

    for fmt in formats:
        try:
            return datetime.strptime(datetime_str, fmt)
        except ValueError:
            continue

    raise ValueError(
        f"time data {datetime_str!r} does not match any known formats")
