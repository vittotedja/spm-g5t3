from typing import List
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pydantic import BaseModel, EmailStr
from starlette.requests import Request
from starlette.responses import JSONResponse
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
import os
import smtplib
from dotenv import load_dotenv
from supabase import create_client, Client
from enum import Enum

load_dotenv()

app = FastAPI(swagger_ui_parameters={"displayRequestDuration": True})
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()

class ApplicationStatus(str, Enum):
    Applied = "Applied"
    Shortlisted = "Shortlisted"
    Rejected = "Rejected"
    Withdrawn = "Withdrawn"

conf = ConnectionConfig(
   MAIL_USERNAME=os.getenv('MAIL_USERNAME'),
   MAIL_PASSWORD=os.getenv('MAIL_PASSWORD'),
   MAIL_PORT=587,
   MAIL_SERVER="smtp.gmail.com",
   MAIL_STARTTLS=True,
   MAIL_SSL_TLS=False,
   MAIL_FROM=os.getenv('MAIL_USERNAME')
   
)

@app.post("/api/notification")
@router.post("/api/notification")
async def send_email(status: str = None, application_id: int = None, listing_id: int = None):


    application = (
            supabase.table("application")
            .select("*")
            .eq("application_id", application_id)
            .execute()
            .data
        )
    
    role = (
        supabase.table("listing").select("*", "role(*)").eq("listing_id", application[0]["listing_id"]).execute().data
    )
    staff = (
           supabase.table("staff").select("*").eq("staff_id", application[0]["staff_id"]).execute().data
    )
    
    email = staff[0]["email"]



    if status == "Shortlisted":
        message = MessageSchema(
        subject="Application for "+ role[0]["role"]["role_name"] +" Shorlisted",
        recipients=[email],
        body="""
            <html>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin-top: 30px;">
                    <div style="background-color: #299B71; color: #ffffff; text-align: center; padding: 10px; border-radius: 10px 10px 0 0;">
                            <img src="https://ujjnudccckrqqtttlkoo.supabase.co/storage/v1/object/public/spm-assets/glasswindow_white.png" alt="Your Image Description" style="max-width: 15%; margin-bottom: 10px;">
                        <h1>Glass Window</h1>
                    </div>
                    <h1 style="color: #333333;">Application Shortlisted</h1>
                    <p style="color: #555555;">Dear """ + staff[0]["staff_fname"] + " " + staff[0]["staff_lname"]+ """,</p> 
                    <p style="color: #555555;">Congratulations! We are pleased to inform you that you have been shortlisted for the position of """ + role[0]["role"]["role_name"]+ """.</p>
                    <p style="color: #555555;">Thank you for your interest. We appreciate the time and effort you invested in the application process.</p>
                    <p style="color: #555555;">If you have any questions or would like feedback on your application, please feel free to reach out.</p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="https://glasswindow.vercel.app" style="display: inline-block; background-color: #299B71; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; transition: background-color 0.3s;">
                            Visit Site
                        </a>
                    </div>
                    <p style="color: #555555;">Best regards,</p>
                    <p style="color: #555555;">All in One Hiring Team</p>
                </div>
            </body>
            </html>
            """,           
        subtype="html")
    elif status == "Rejected":
        message = MessageSchema(
        subject="Application for "+ role[0]["role"]["role_name"] +" Rejected",
        recipients=[email],
        body="""
            <html>
            <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin-top: 30px;">
                    <div style="background-color: #299B71; color: #ffffff; text-align: center; padding: 10px; border-radius: 10px 10px 0 0;">
                            <img src="https://ujjnudccckrqqtttlkoo.supabase.co/storage/v1/object/public/spm-assets/glasswindow_white.png" alt="Your Image Description" style="max-width: 15%; margin-bottom: 10px;">
                        <h1>Glass Window</h1>
                    </div>
                    <h1 style="color: #333333;">Application Rejected</h1>
                    <p style="color: #555555;">Dear """ + staff[0]["staff_fname"] + " " + staff[0]["staff_lname"]+ """,</p> 
                    <p style="color: #555555;">We regret to inform you that we have chosen not to move forward with your application for the position of """ + role[0]["role"]["role_name"]+ """.</p>
                    <p style="color: #555555;">Thank you for your interest. We appreciate the time and effort you invested in the application process.</p>
                    <p style="color: #555555;">If you have any questions or would like feedback on your application, please feel free to reach out.</p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="https://glasswindow.vercel.app" style="display: inline-block; background-color: #299B71; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; transition: background-color 0.3s;">
                            Go to Site
                        </a>
                    </div>
                    <p style="color: #555555;">Best regards,</p>
                    <p style="color: #555555;">All in One Hiring Team</p>
                </div>
            </body>
            </html>
            """,           
        subtype="html")
    elif listing_id:
        staffs = supabase.table("application").select("staff_id").eq("listing_id", listing_id).execute().data[0]
        emails = supabase.table("staff").select("email").eq("staff_id", staffs["staff_id"]).execute().data[0]

        for email in emails.values():
            message = MessageSchema(
            subject="Listing for "+ role[0]["role"]["role_name"] +" Updated",
            recipients=[email],
            body="""
                <html>
                <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin-top: 30px;">
                        <div style="background-color: #299B71; color: #ffffff; text-align: center; padding: 10px; border-radius: 10px 10px 0 0;">
                                <img src="https://ujjnudccckrqqtttlkoo.supabase.co/storage/v1/object/public/spm-assets/glasswindow_white.png" alt="Your Image Description" style="max-width: 15%; margin-bottom: 10px;">
                            <h1>Glass Window</h1>
                        </div>
                        <h1 style="color: #333333;">Listing Application Details</h1>
                        <p style="color: #555555;">Dear """ + staff[0]["staff_fname"] + " " + staff[0]["staff_lname"]+ """,</p> 
                        <p style="color: #555555;">We inform you that the Listing details for """ + role[0]["role"]["role_name"]+ """ has been Updated.</p>
                        <p style="color: #555555;">Your Application is still submitted and will be considered.</p>
                        <p style="color: #555555;">If you have any questions or would like feedback on your application, please feel free to reach out.</p>
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="https://glasswindow.vercel.app" style="display: inline-block; background-color: #299B71; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; transition: background-color 0.3s;">
                                Go to Site
                            </a>
                        </div>
                        <p style="color: #555555;">Best regards,</p>
                        <p style="color: #555555;">All in One Hiring Team</p>
                    </div>
                </body>
                </html>
                """,           
            subtype="html") 
            fm = FastMail(conf)
            await fm.send_message(message)
            print(message)

    fm = FastMail(conf)
    await fm.send_message(message)
    print(message)

    return JSONResponse(status_code=200, content={"message": "email has been sent"})
    

