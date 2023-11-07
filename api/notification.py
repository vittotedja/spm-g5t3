from typing import List
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
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
    Shortlisted = "Shortlisted"
    Rejected = "Rejected"

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
async def send_email(status: str = None, application_id: int = None, listing_id: int = None, staff_id: int = None):

    if status == "Shortlisted":
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
        fm = FastMail(conf)
        await fm.send_message(message)
        print(message)
    elif status == "Rejected":
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
        fm = FastMail(conf)
        await fm.send_message(message)
        print(message)
    elif listing_id and staff_id: #for Invitation
        # Fetch role details
        role_response = supabase.table("listing").select("*", "role(*)").eq("listing_id", listing_id).execute()
        role = role_response.data if role_response.data else []
        if not role:
            return JSONResponse(status_code=400, content={"message": "Listing not found"})
        # Fetch staff details
        staff_response = supabase.table("staff").select("*").eq("staff_id", staff_id).execute()
        staff_data = staff_response.data if staff_response.data else []
        if not staff_data:
            return JSONResponse(status_code=400, content={"message": "Staff not found"})
        email_per_staff = staff_data[0].get("email")
        if email_per_staff:
            # Construct the invitation to apply email
            message = MessageSchema(
                subject=f"Invitation to Apply for {role[0]['role']['role_name']} Position",
                recipients=[email_per_staff],
                body=f"""
                    <html>
                    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin-top: 30px;">
                            <div style="background-color: #299B71; color: #ffffff; text-align: center; padding: 10px; border-radius: 10px 10px 0 0;">
                                <img src="https://ujjnudccckrqqtttlkoo.supabase.co/storage/v1/object/public/spm-assets/glasswindow_white.png" alt="Your Image Description" style="max-width: 15%; margin-bottom: 10px;">
                                <h1>Glass Window</h1>
                            </div>
                            <h1 style="color: #333333;">You're Invited!</h1>
                            <p style="color: #555555;">Dear {staff_data[0]['staff_fname']} {staff_data[0]['staff_lname']},</p> 
                            <p style="color: #555555;">We have been following your career with great interest and are impressed by your achievements. We believe that your skills and background align well with the {role[0]['role']['role_name']} role we have open.</p>
                            <p style="color: #555555;">We would like to formally invite you to apply for this position at Glass Window. This role offers the opportunity to [include exciting opportunities, project details, impact of the role, etc.].</p>
                            <p style="color: #555555;">Please visit our careers page or click the link below to submit your application and learn more about this exciting opportunity.</p>
                            <div style="text-align: center; margin-top: 20px;">
                                <a href="https://glasswindow.vercel.app/careers/{role[0]['role']['role_id']}" style="display: inline-block; background-color: #299B71; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; transition: background-color 0.3s;">
                                    Apply Now
                                </a>
                            </div>
                            <p style="color: #555555;">We are looking forward to the possibility of you joining our team!</p>
                            <p style="color: #555555;">Best regards,</p>
                            <p style="color: #555555;">The Recruiting Team at Glass Window</p>
                        </div>
                    </body>
                    </html>
                    """,
                subtype="html"
            )
            fm = FastMail(conf)
            await fm.send_message(message)
            print(message)
    elif listing_id and staff_id == None: # if staff_id is None, send email to all staffs if listing is edited
        role = (
            supabase.table("listing").select("*", "role(*)").eq("listing_id", listing_id).execute().data
        )
        response = supabase.table("application").select("staff_id").eq("listing_id", listing_id).execute()
        staffs = response.data if response.data else []
        for staff_dict in staffs:
            staff_id = staff_dict.get("staff_id")
            if staff_id is None:
                continue  # skip this iteration if staff_id is None
            staff_response = supabase.table("staff").select("*").eq("staff_id", staff_id).execute()
            staff_data = staff_response.data if staff_response.data else []
            if not staff_data:
                continue  # skip this iteration if no data found
            email_per_staff = staff_data[0].get("email")
            if email_per_staff:
                # ... create your message and send email
                # ensure you are handling the rest correctly
                message = MessageSchema(
                subject="Listing for "+ role[0]["role"]["role_name"] +" Updated",
                recipients=[email_per_staff],
                body="""
                    <html>
                    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); margin-top: 30px;">
                            <div style="background-color: #299B71; color: #ffffff; text-align: center; padding: 10px; border-radius: 10px 10px 0 0;">
                                    <img src="https://ujjnudccckrqqtttlkoo.supabase.co/storage/v1/object/public/spm-assets/glasswindow_white.png" alt="Your Image Description" style="max-width: 15%; margin-bottom: 10px;">
                                <h1>Glass Window</h1>
                            </div>
                            <h1 style="color: #333333;">Listing Application Details</h1>
                            <p style="color: #555555;">Dear """ + staff_data[0]["staff_fname"] + " " + staff_data[0]["staff_lname"]+ """,</p> 
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

    return JSONResponse(status_code=200, content={"message": "email has been sent"})
    

