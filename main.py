from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import (
    staff,
    staff_role,
    staff_skill,
    staff_role_skill,
    role,
    skill,
    application,
    listing,
    listing_manager,
    new_data_handling,
    notification,
)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(staff.router)
app.include_router(staff_role.router)
app.include_router(staff_skill.router)
app.include_router(staff_role_skill.router)
app.include_router(role.router)
app.include_router(skill.router)
app.include_router(application.router)
app.include_router(listing.router)
app.include_router(listing_manager.router)
app.include_router(new_data_handling.router)
app.include_router(notification.router)
