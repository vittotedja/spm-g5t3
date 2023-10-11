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
async def staff_role(staff_id: int = None, page: int = 1, limit: int = 5, sort_field: str = 'creation_date', order: str = 'asc', filters: str = '{}'):
    parsed_filters = json.loads(filters)
    if staff_id:
        offset = (page - 1) * limit
        all_skills = supabase.table("skill").select("skill_id, skill_name").execute().data
        df_skills = pd.DataFrame(all_skills)  
        
        # Fetch all roles from the database
        all_roles_response = supabase.table("role").select("*").execute()
        df_all_roles = pd.DataFrame(all_roles_response.data or [])

        # Fetch all managers from the database
        all_listing_manager_response = supabase.table("listing_manager").select("*").execute()
        df_listing_manager = pd.DataFrame(all_listing_manager_response.data or [])

        #Fetch all staff from the database
        all_staff_response = supabase.table("staff").select("*").execute()
        df_staff = pd.DataFrame(all_staff_response.data or [])

        # Fetch all listings from the database
        all_listings_response = supabase.table("listing").select("*").execute()
        df_all_listings = pd.DataFrame(all_listings_response.data or [])  

        # Merge roles and listings
        df_merged_roles_listings = pd.merge(df_all_roles, df_all_listings, on='role_id', how='left')
        
        # Fetch all role-skill associations
        all_role_skills = supabase.table("role_skill").select("*").execute().data
        df_role_skills = pd.DataFrame(all_role_skills)
        
        # Associate skills with roles
        df_all_roles['role_skill'] = df_all_roles['role_id'].apply(lambda x: df_role_skills[df_role_skills['role_id'] == x]['skill_id'].tolist())
        
        # Get applied roles for the user
        applied_roles_response = supabase.table("application").select("listing_id").eq("staff_id", str(staff_id)).execute()
        applied_listing_IDs = [app["listing_id"] for app in applied_roles_response.data or []]

        # Fetch role_ids for the applied listings
        applied_role_IDs_response = supabase.table("listing").select("role_id").in_("listing_id", applied_listing_IDs).execute()
        applied_role_IDs = [listing["role_id"] for listing in applied_role_IDs_response.data or []]

        # Filter out the applied roles
        df_unapplied_listings = df_all_listings[~df_all_listings['listing_id'].isin(applied_listing_IDs)]

        
        # Merge with listing_manager and staff
        df_unapplied_listings = pd.merge(df_unapplied_listings, df_all_roles, on='role_id', how='left')
        df_unapplied_listings = pd.merge(df_unapplied_listings, df_listing_manager, on='listing_id', how='left')
        df_unapplied_listings = pd.merge(df_unapplied_listings, df_staff, left_on='manager_id', right_on='staff_id', how='left', suffixes=('', '_manager'))

        # Explode the 'role_skill' column
        df_exploded = df_unapplied_listings.explode('role_skill')
        df_merged = pd.merge(df_exploded, df_skills, left_on='role_skill', right_on='skill_id', how='inner')
        unique_skills = df_merged['skill_name'].drop_duplicates().sort_values().tolist()
        

        unique_role_names = df_unapplied_listings['role_name'].dropna().drop_duplicates().sort_values().tolist()
        unique_departments = df_unapplied_listings["dept"].dropna().drop_duplicates().sort_values().tolist()
        unique_regions = df_unapplied_listings["country"].dropna().drop_duplicates().sort_values().tolist()

        # Apply Filters Directly on the Merged DataFrame
        if 'Skills' in parsed_filters and parsed_filters['Skills']:
            skill_name_filters = parsed_filters['Skills']
            matching_skill_ids = df_skills[df_skills['skill_name'].isin(skill_name_filters)]['skill_id'].tolist()
            df_unapplied_listings = df_unapplied_listings[df_unapplied_listings['role_skill'].apply(lambda x: any(skill_id in matching_skill_ids for skill_id in x))]

        if 'Role Name' in parsed_filters and parsed_filters['Role Name']:
            role_name_filters = parsed_filters['Role Name']
            df_unapplied_listings = df_unapplied_listings[df_unapplied_listings['role_name'].isin(role_name_filters)]

        if 'Department' in parsed_filters and parsed_filters['Department']:
            department_filters = parsed_filters['Department']
            df_unapplied_listings = df_unapplied_listings[df_unapplied_listings['dept'].isin(department_filters)]

        if 'Region' in parsed_filters and parsed_filters['Region']:
            region_filters = parsed_filters['Region']
            df_unapplied_listings = df_unapplied_listings[df_unapplied_listings['country_manager'].isin(region_filters)]

        today = datetime.utcnow().replace(tzinfo=timezone.utc)
        roles_with_date = df_unapplied_listings[(df_unapplied_listings['application_close_date'].notnull()) & (pd.to_datetime(df_unapplied_listings['application_close_date'], utc=True) >= today) & (~df_unapplied_listings['role_id'].isin(applied_role_IDs))]
        roles_without_date = df_unapplied_listings[(df_unapplied_listings['application_close_date'].isnull()) & (~df_unapplied_listings['role_id'].isin(applied_role_IDs))]
        if sort_field == 'application_close_date':
            roles_with_date = roles_with_date.sort_values(by='application_close_date', ascending=(order != 'desc'))
            all_unapplied_roles = pd.concat([roles_with_date, roles_without_date])
        else:
            all_unapplied_roles = pd.concat([roles_with_date, roles_without_date])
            if sort_field in ['creation_date', 'application_close_date']:
                all_unapplied_roles = all_unapplied_roles.sort_values(by=sort_field, ascending=(order != 'desc'))
            else: 
                all_unapplied_roles = all_unapplied_roles.sort_values(by=sort_field, ascending=(order != 'desc'))
        # all_unapplied_roles = all_unapplied_roles.drop_duplicates(subset=['listing_id'])
        unapplied_roles_df = all_unapplied_roles.iloc[offset:offset+limit]
        unapplied_roles_df = unapplied_roles_df.fillna(value='')
        unapplied_roles = unapplied_roles_df.to_dict('records')
        staff_skill_response = supabase.table("staff_skill").select(
            "skill_id").eq("staff_id", str(staff_id)).execute()
        staff_skill_ids_set = set(skill['skill_id']
                                  for skill in staff_skill_response.data or [])
        for role in unapplied_roles:
            role_skill_id_set = {skill for skill in role.get('role_skill', [])}
            matched_skills = staff_skill_ids_set.intersection(role_skill_id_set)
            percentage_match = (len(matched_skills) / len(role_skill_id_set)) * 100 if role_skill_id_set else 0
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
            "all_regions": unique_regions,
            "all_roles": unique_role_names,
            "all_skills": unique_skills,
            "all_departments": unique_departments
        }
    else:
        result = supabase.table("role").select("*").execute()
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