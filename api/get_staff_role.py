from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime, timezone
import math
import json

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


@app.get("/api/get_staff_role")
@router.get("/api/get_staff_role")
async def get_staff_role(user_id: int = None, page: int = 1, limit: int = 5, sort_field: str = 'created_at', order: str = 'asc', filters: str = '{}'):
    parsed_filters = json.loads(filters)
    if user_id:
        offset = (page - 1) * limit
      # Default query to fetch roles and their associated skills
        query = supabase.table("role").select(
            "*, role_skill!role_skill_role_id_fkey(skill_id)")

        # Fetch all skills, role_skills, and roles in one go
        all_skills = supabase.table("skill").select("*").execute().data
        all_role_skills = supabase.table("role_skill").select("*").execute().data

        # If skill filter is applied
        if 'Skills' in parsed_filters and parsed_filters['Skills']:
            skill_name_filters = parsed_filters['Skills']
            print(skill_name_filters)

            # Find the skill_id for the given skill_name from the fetched data
            matching_skill_ids = [skill['skill_id'] for skill in all_skills if skill['skill_name'] in skill_name_filters]
            print("MATCHING IDS",matching_skill_ids)
            
            # Extract role_ids associated with the skill_id from the fetched role_skill data
            role_ids = [role_skill['role_id'] for role_skill in all_role_skills if role_skill['skill_id'] in matching_skill_ids]
            print("ROLE IDS",role_ids)
            query = query.in_("role_id", role_ids)

        if 'Region' in parsed_filters and parsed_filters['Region']:
            region_filters = parsed_filters['Region']
            query = query.in_("location", region_filters)
        if 'Role Name' in parsed_filters and parsed_filters['Role Name']:
            role_name_filters = parsed_filters['Role Name']
            query = query.in_("role_name", role_name_filters)
        if 'Department' in parsed_filters and parsed_filters['Department']:
            department_filters = parsed_filters['Department']
            query = query.in_("dept", department_filters)

        # Get applied roles
        applied_roles_response = supabase.table("application").select(
            "role_id").eq("staff_id", str(user_id)).execute()
        applied_role_IDs = [role["role_id"]
                            for role in applied_roles_response.data or []]

        today = datetime.utcnow().replace(tzinfo=timezone.utc)

        # Get all roles and filter out the applied ones
        all_roles_response = query.execute()

        # Separate roles with null appl_close_date and those with a valid date
        roles_with_date = [role for role in all_roles_response.data or [] if role["appl_close_date"] is not None and datetime.fromisoformat(
            role["appl_close_date"]) >= today and role["role_id"] not in applied_role_IDs]
        roles_without_date = [role for role in all_roles_response.data or [
        ] if role["appl_close_date"] is None and role["role_id"] not in applied_role_IDs]

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
            "skill_id").eq("staff_id", str(user_id)).execute()
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
