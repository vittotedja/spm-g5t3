from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import pandas as pd
from fuzzywuzzy import fuzz
import math

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


@app.get("/api/staff")
@router.get("/api/staff")
async def staff(
    email: str = None, staff_id: int = None, name: str = None, isManager: bool = None, listing_id: int = None
):
    if email:
        staff = supabase.from_("staff").select("*").ilike("email", email).execute().data
        if not staff:
            raise HTTPException(
                status_code=404, detail="Staff not found with the provided email."
            )
        return staff
    elif name and staff_id:
        if len(name) == 0:
            return []
        response = (
            supabase.table("staff")
            .select("staff_fname, staff_lname, dept, country, control_access, staff_id")
            .execute()
        )
        df = pd.DataFrame(response.data)
        df = df[df["control_access"].isin([2, 3, 4])]
        df = df[df["staff_id"] != staff_id]
        df["similarity"] = df.apply(
            lambda row: fuzz.token_sort_ratio(
                name, row["staff_fname"] + " " + row["staff_lname"]
            ),
            axis=1,
        )
        df["link"] = df["staff_id"].apply(lambda x: f"/applicantdetail?staff_id={x}")
        sorted_df = df.sort_values(by="similarity", ascending=False)
        sorted_df = sorted_df.drop(columns=["similarity"])
        #drop the row with staff_id = staff_id
        sorted_df = sorted_df[sorted_df["staff_id"] != staff_id]
        sorted_data = sorted_df.to_dict(orient="records")[0:5]
        return sorted_data
    elif isManager and staff_id and listing_id:
        # 1. Fetch the staff table.
        staff_data = supabase.from_("staff").select("*").execute().data
        staff_df = pd.DataFrame(staff_data)

        # 4. Filter out the staff who has applied to this listing.
        applied_staff = supabase.from_("application").select("staff_id").eq("listing_id", listing_id).execute().data
        applied_staff_ids = [item['staff_id'] for item in applied_staff]
        merged_df = staff_df[~staff_df["staff_id"].isin(applied_staff_ids)]

        # 5. Filter out the staff who is logged in (staff_id).
        merged_df = merged_df[merged_df["staff_id"] != staff_id]

        # 6. Make sure the staff has access control in [2,3,4].
        merged_df = merged_df[merged_df["control_access"].isin([2, 3, 4])]

        # 7. Fetch listing role skill set.
        listing_data = supabase.from_("listing").select("*, role(*)").eq("listing_id", listing_id).execute().data
        role_id = listing_data[0]["role"]["role_id"]
        role_skill = supabase.from_("role_skill").select("skill_id").eq("role_id", role_id).execute().data
        role_skill_set = {item['skill_id'] for item in role_skill}

        all_staff_skills = supabase.from_("staff_skill").select("*").execute().data
        all_staff_skills_df = pd.DataFrame(all_staff_skills)

        # Group by staff_id to get a list of skill_ids for each staff
        merged_df_with_skills = pd.merge(merged_df, all_staff_skills_df, on="staff_id", how='inner')
        # Assuming merged_df_with_skills is the result of your merge
        grouped = merged_df_with_skills.groupby([
            "staff_id", "staff_fname", "staff_lname", "dept", "country", "email", "control_access"
        ])["skill_id"].apply(list).reset_index()

        # 8. Calculate the match percentage for every staff.
        def calculate_match_percentage(skills):
            if isinstance(skills, list):
                skill_set = {int(skill) for skill in skills if not math.isnan(skill)}
                intersecting_skills = skill_set.intersection(role_skill_set)
                return (len(intersecting_skills) / len(role_skill_set)) * 100 if skill_set else 0
            return 0

        # Assuming staff_skill_set is the set of skills for the logged-in staff member
        grouped['match_percentage'] = grouped['skill_id'].apply(calculate_match_percentage)

        # 9. Sort by match percentage.
        grouped.sort_values(by=["match_percentage"], ascending=False, inplace=True)

        return grouped.to_dict(orient="records")
    elif staff_id:
        if staff_id == 0:
            staff = supabase.from_("staff").select("*").execute().data
            return staff
        staff = (
            supabase.from_("staff").select("*").eq("staff_id", staff_id).execute().data
        )
        if not staff:
            raise HTTPException(
                status_code=404, detail="Staff not found with the provided staff_id."
            )
        return staff

    else:
        staff = supabase.from_("staff").select("*").execute().data
        return staff
