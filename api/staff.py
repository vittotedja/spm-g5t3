from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from supabase import create_client, Client
import pandas as pd
from fuzzywuzzy import fuzz

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
    email: str = None, staff_id: int = None, name: str = None, isManager: bool = None
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
    elif isManager and staff_id:
        staff = supabase.from_("staff").select("*").execute().data
        access_control = supabase.from_("access_control").select("*").execute().data
        df_staff = pd.DataFrame(staff)
        df_staff = df_staff.merge(
            pd.DataFrame(access_control), left_on="control_access", right_on="access_id"
        )
        df_staff = df_staff[df_staff["staff_id"] != staff_id]
        filtered_df = df_staff[df_staff["control_access"].isin([2, 3, 4])]
        filtered_df.sort_values(by=["staff_fname", "staff_lname"], inplace=True)
        return filtered_df.to_dict(orient="records")
    elif staff_id:
        # get all staff if staff_id = 0
        if staff_id == 0:
            staff = supabase.from_("staff").select("*").execute().data
            return staff
        
        # get staff with staff_id
        staff = supabase.from_("staff").select("*").eq("staff_id", staff_id).execute().data

        # get current role of staff if any from application table
        role = (
            supabase
            .from_("application")
            .select("*, listing(listing_id, listing_location, role(role_id, role_name, role_department))")
            .eq('staff_id', staff_id)
            .eq('application_status', 'Accepted')
            .order('updated_at', desc = True)
            .limit(1)
            .execute().data
        )
        # case if staff has no role
        if not role:
            staff[0]['curr_role'] = {
                'role_id': None,
                'role_name': 'No role assigned',
                'role_department': 'Not in any department',
                'role_location': None
            }
            return staff

        # insert role data into staff dict if staff has role
        staff[0]['curr_role'] = role[0]['listing']['role']
        staff[0]['curr_role']['role_location'] = role[0]['listing']['listing_location']

        # raise error if staff not found
        if not staff:
            raise HTTPException(
                status_code=404, detail="Staff not found with the provided staff_id."
            )
        return staff

    else:
        staff = supabase.from_("staff").select("*").execute().data
        return staff
