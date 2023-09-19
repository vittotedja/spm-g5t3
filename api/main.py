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
async def get_roles(userid: int = None):
    userid = str(userid)
    if userid:
        # Fetch the roles the user has already applied to
        applied_roles = supabase.table("Applications").select(
            "Role_ID").eq("Staff_ID", userid).execute()
        applied_role_IDs = [role["Role_ID"]
                        for role in applied_roles.get("data", [])]

        # Fetch all roles
        all_roles = supabase.table("Roles").select("*").execute().get("data", [])

        # Filter out roles the user has already applied to
        unapplied_roles = [
        role for role in all_roles if role["Role_ID"] not in applied_role_IDs]

        # Fetch the user's skills
        user_skills_data = supabase.table("Staff_Skill").select(
            "Skill_ID").eq("Staff_ID", userid).execute()
        user_skills_IDs = user_skills_data.get("data", [])
        # Calculate the percentage match for each role
        for role in unapplied_roles:
            role_skills_data = supabase.table("Role_Skill").select(
                "Skill_ID").eq("Role_ID", str(role["Role_ID"])).execute()
            role_skills_IDs = role_skills_data.get("data", [])

            user_skill_ids_set = {skill['Skill_ID'] for skill in user_skills_IDs}
            role_skill_ids_set = {skill['Skill_ID'] for skill in role_skills_IDs}

            matched_skills = user_skill_ids_set.intersection(role_skill_ids_set)
            percentage_match = (
                len(matched_skills) / len(role_skills_IDs)) * 100 if role_skills_IDs else 0
            role["percentage_match"] = percentage_match

        return {"data": unapplied_roles}
    else:
        result = supabase.table("Roles").select().execute()
        if 'error' in result:
            return {"error": result.get("error", "Failed to fetch data from Supabase")}

        return {"data":  result.get("data", [])}