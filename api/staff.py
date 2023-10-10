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
async def staff(email: str = None, staff_id: int = None, name: str = None, isManager: bool = None):
    if email:
        staff = supabase.from_('staff').select("*").eq('email', email).execute().data
        if not staff:
            raise HTTPException(status_code=404, detail="Staff not found with the provided email.")
        return staff
    elif staff_id:
        if staff_id == 0:
            staff = supabase.from_("staff").select("*").execute().data
            return staff
        staff = supabase.from_('staff').select("*").eq('staff_id', staff_id).execute().data
        if not staff:
            raise HTTPException(status_code=404, detail="Staff not found with the provided staff_id.")
        return staff
    elif name:
        response = supabase.table("staff").select("staff_fname, staff_lname, staff_id, dept").execute()
        df = pd.DataFrame(response.data)
        df['similarity'] = df.apply(lambda row: fuzz.token_sort_ratio(name, row['staff_fname'] + " " + row['staff_lname']), axis=1)
        df['link'] = df['staff_id'].apply(lambda x: f"/applicantdetail?staff_id={x}")
        sorted_df = df.sort_values(by="similarity", ascending=False)
        sorted_df = sorted_df.drop(columns=['similarity'])
        sorted_data = sorted_df.to_dict(orient='records')[0:5]
        return sorted_data
    elif isManager:
        staff = supabase.from_('staff').select("*").execute().data
        df_staff = pd.DataFrame(staff)
        filtered_df = df_staff[df_staff['control_access'].isin([2, 3])]
        filtered_df.sort_values(by=['staff_fname', 'staff_lname'], inplace=True)
        return filtered_df.to_dict(orient='records')
    else:
        staff = supabase.from_("staff").select("*").execute().data
        return staff