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
async def staff_role(staff_id: int = None, page: int = 1, limit: int = 5, sort_field: str = 'created_at', order: str = 'asc', filters: str = '{}'):
    parsed_filters = json.loads(filters)
    if staff_id:
        offset = (page - 1) * limit
        all_skills = supabase.table("skill").select("*").execute().data
        df_skills = pd.DataFrame(all_skills)  

        # Fetch all roles from the database
        all_roles_response = supabase.table("role").select(
            "*, role_skill!role_skill_role_id_fkey(skill_id)").execute()
        df_all_roles = pd.DataFrame(all_roles_response.data or [])

        # Get applied roles for the user
        applied_roles_response = supabase.table("application").select("role_id").eq("staff_id", str(staff_id)).execute()
        applied_role_IDs = [role["role_id"] for role in applied_roles_response.data or []]

        # Filter out the applied roles
        all_unapplied_roles_no_filters = df_all_roles[~df_all_roles['role_id'].isin(applied_role_IDs)]
        unique_skill_ids = set()
        for skill_list in all_unapplied_roles_no_filters['role_skill']:
            for skill in skill_list:
                unique_skill_ids.add(skill['skill_id'])
        filtered_skills = df_skills[df_skills['skill_id'].isin(unique_skill_ids)]
        all_skills = filtered_skills['skill_name'].tolist()
        df = pd.DataFrame(all_unapplied_roles_no_filters)
        all_role_names = df['role_name'].drop_duplicates().sort_values().tolist()
        all_departments = df['dept'].drop_duplicates().sort_values().tolist()
        all_regions = df['location'].dropna().drop_duplicates().sort_values().tolist()

        # Filter roles by skill ID
        if 'Skills' in parsed_filters and parsed_filters['Skills']:
            skill_name_filters = parsed_filters['Skills']
            matching_skill_ids = df_skills[df_skills['skill_name'].isin(skill_name_filters)]['skill_id'].tolist()
            df = df[df['role_skill'].apply(lambda x: any(skill['skill_id'] in matching_skill_ids for skill in x))]

        # Filter roles by region
        if 'Region' in parsed_filters and parsed_filters['Region']:
            region_filters = parsed_filters['Region']
            df = df[df['location'].isin(region_filters)]

        # Filter roles by role name
        if 'Role Name' in parsed_filters and parsed_filters['Role Name']:
            role_name_filters = parsed_filters['Role Name']
            df = df[df['role_name'].isin(role_name_filters)]

        # Filter roles by department
        if 'Department' in parsed_filters and parsed_filters['Department']:
            department_filters = parsed_filters['Department']
            df = df[df['dept'].isin(department_filters)]


        today = datetime.utcnow().replace(tzinfo=timezone.utc)
        roles_with_date = df[(df['appl_close_date'].notnull()) & (pd.to_datetime(df['appl_close_date'], utc=True) >= today) & (~df['role_id'].isin(applied_role_IDs))]
        roles_without_date = df[(df['appl_close_date'].isnull()) & (~df['role_id'].isin(applied_role_IDs))]

        if sort_field == 'appl_close_date':
            roles_with_date = roles_with_date.sort_values(by='appl_close_date', ascending=(order != 'desc'))
            all_unapplied_roles = pd.concat([roles_with_date, roles_without_date])
        else:
            all_unapplied_roles = pd.concat([roles_with_date, roles_without_date])
            if sort_field in ['created_at', 'application_date']:
                all_unapplied_roles = all_unapplied_roles.sort_values(by=sort_field, ascending=(order != 'desc'))
            else: 
                all_unapplied_roles = all_unapplied_roles.sort_values(by=sort_field, ascending=(order != 'desc'))

        unapplied_roles_df = all_unapplied_roles.iloc[offset:offset+limit]
        unapplied_roles = unapplied_roles_df.to_dict('records')

        staff_skill_response = supabase.table("staff_skill").select(
            "skill_id").eq("staff_id", str(staff_id)).execute()
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
            },
            "all_regions": all_regions,
            "all_roles": all_role_names,
            "all_skills": all_skills,
            "all_departments": all_departments
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

def fetch_all_skill():
    skills = supabase.from_('skill').select("skill_name").execute().data
    df = pd.DataFrame(skills)
    return df['skill_name'].drop_duplicates().sort_values().tolist()