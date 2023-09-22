from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
from dotenv import load_dotenv
from supabase import create_client, Client

import pandas as pd

load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = FastAPI()

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

@app.get("/api/test")
async def test():
    return {"message": "Hello World"}

@app.get("/api/test/test2")
async def test2():
    return {"message": "Hello World 2"}

@app.get("/api/test/test3")
async def test3(test: str):
    return {"message": f"Hello {test}"}

@app.get("/api/staff")
async def get_staff(staff_id: int):
    staff = supabase.from_('staff').select("*").eq('staff_id', staff_id).execute().data[0]
    return staff

@app.get("/api/staff/staff2")
async def staff2():
    return {"message": "Hello World 2"}

@app.get("/api/staff/staff3")
async def staff3(test: str):
    return {"message": f"Hello {test}"}