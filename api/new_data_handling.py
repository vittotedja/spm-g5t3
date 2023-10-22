from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv
# from dataset import new_staff
load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = FastAPI(swagger_ui_parameters={"displayRequestDuration": True})

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
router = APIRouter()

@router.post("/new_data_handling/")
async def new_data_handling(file: str):
    filepath = '../src/dataset/' + file + '.csv'
    if not os.path.exists(filepath):
        raise HTTPException(status_code=400, detail="File not found")

    df = pd.read_csv(filepath)

    # Handling case insensitive column names
    email_column = next((col for col in df.columns if col.lower() == 'email'), None)
    if email_column is None:
        raise HTTPException(status_code=400, detail="Email column not found in CSV")

    # Fetch all users
    response = await supabase.auth.api.get_users()
    if response['error']:
        raise HTTPException(status_code=400, detail=response['error']['message'])   

    existing_emails = [user['email'] for user in response['data']]

    # Find the new staff emails using Pandas
    new_staff_df = df[~df[email_column].isin(existing_emails)]

    for index, new_staff in new_staff_df.iterrows():
        # Create a new user for each new staff email
        insert_to_db = (await supabase.table('staff')
                        .insert({
                            "staff_id":new_staff['staff_id'],
                            'staff_fname':new_staff['staff_fname'],
                            'staff_lname':new_staff['staff_lname'],
                            'dept':new_staff['dept'],
                            'country':new_staff['country'],
                            'email':new_staff['email'],
                            'role':new_staff['role']
                        })
                        .execute())
        
        password = new_staff['email'].split('@')[0]
        response = await supabase.auth.sign_up(email=new_staff['email'], password=password).execute()
        if response['error']:
            raise HTTPException(status_code=400, detail='Error at:' + response['error']['message'])

    return {"message": "Staff checked and accounts created if not existed"}

app.include_router(router)
