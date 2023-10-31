from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv
import gdown
from apscheduler.schedulers.background import BackgroundScheduler
import asyncio

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
scheduler = BackgroundScheduler()
scheduler.start()
def run_on_schedule():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(new_data_handling())
    loop.close()

scheduler.add_job(run_on_schedule, 'cron', hour='*')

router = APIRouter()

@app.post('/api/new_data_handling')
@router.post('/api/new_data_handling')
async def new_data_handling():
    filepath = './src/dataset/new_staff.xlsx'
    file_id = os.getenv('file_id')
    download_url = 'https://drive.google.com/uc?/export=download&id='+ file_id
    # print(download_url)
    gdown.download(download_url, output=filepath, quiet=True)
    #download = requests.get(download_url)
    

    # print("Current working directory:", os.getcwd())
    if not os.path.exists(filepath):
        raise HTTPException(status_code=400, detail="Download failed")

    df = pd.read_excel(filepath)

    # Fetch all users
    response = supabase.table('staff').select('*').execute()

    existing_id = set(user['staff_id'] for user in response.data)
    # print(existing_emails)
    # Find the new staff emails using Pandas
    new_staff_df = df[~df['staff_id'].isin(existing_id)]
    # print(new_staff_df)
    # print(type(new_staff_df))
    new_staff_df = new_staff_df.rename(columns={'role': 'control_access'})
    new_staff_dicts = new_staff_df.to_dict(orient='records')
    print(new_staff_dicts)

    for new_staff in new_staff_dicts:
        insert_to_db = (supabase.table('staff').insert(new_staff).execute())
        password = new_staff['email'].split('@')[0]
        response = supabase.auth.sign_up({
            "email":new_staff['email'],
            "password":password,
            "options":{
                "data": {
                    "staff_id": new_staff['staff_id']
                }
            }
            })
        # if response.error:
            # raise HTTPException(status_code=400, detail='Error at:' + response['error']['message'])

    return {"message": "Staff checked and accounts created if not existed"}

@app.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown()