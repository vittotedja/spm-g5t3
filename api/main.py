import math
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from supabase_py import create_client, Client
from dotenv import load_dotenv

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


@app.get("/api/roles")
async def get_roles(userid: int = None, page: int = 1, limit: int = 5):
    offset = (page - 1) * limit
    if userid:
        applied_roles_response = supabase.table("application").select("role_id").eq("staff_id", str(userid)).execute()
        applied_role_IDs = applied_roles_response.get("data", [])
        applied_role_IDs = [role["role_id"] for role in applied_role_IDs]
        all_roles_response = supabase.table("role").select("*,role_skill(skill_id)").execute()
        all_roles = all_roles_response.get("data", [])
        all_unapplied_roles = [role for role in all_roles if role["role_id"] not in applied_role_IDs]
        all_unapplied_roles = sorted(all_unapplied_roles, key=lambda x: x['role_id'])
        unapplied_roles = all_unapplied_roles[offset:offset+limit]

        user_skills_response = supabase.table("staff_skill").select("skill_id").eq("staff_id", str(userid)).execute()
        user_skills = user_skills_response.get("data", [])
        user_skill_ids_set = {skill['skill_id'] for skill in user_skills}
        for role in unapplied_roles:
            role_skill_ids_set = {skill['skill_id'] for skill in role['role_skill']}
            matched_skills = user_skill_ids_set.intersection(role_skill_ids_set)
            percentage_match = (len(matched_skills) / len(role_skill_ids_set)) * 100 if role_skill_ids_set else 0
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
        if 'error' in result:
            return {"error": result.get("error", "Failed to fetch data from Supabase")}

        return {"data":  result.get("data", [])}