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
    get_applicants,
    get_skillmatch,
    manager_rolelisting,
    listing,
    listing_manager,
    get_totalapplications,
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
app.include_router(manager_rolelisting.router)

# use api.staff_role_skill instead
app.include_router(get_skillmatch.router)

# use api.application instead
app.include_router(get_totalapplications.router)

# use api.application instead, and get skill match with api.staff_role_skill
app.include_router(get_applicants.router)
