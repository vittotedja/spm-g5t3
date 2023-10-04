from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import get_applicants, get_role_skill, get_role, get_skillmatch, get_staff_role_skill, get_staff_role, get_staff_skill, get_staff, get_totalapplications, post_application, get_manager_role,get_skill

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(get_applicants.router)
app.include_router(get_role_skill.router)
app.include_router(get_role.router)
app.include_router(get_skillmatch.router)
app.include_router(get_staff_role_skill.router)
app.include_router(get_manager_role.router)
app.include_router(get_skill.router)
app.include_router(get_staff_role.router)
app.include_router(get_staff_skill.router)
app.include_router(get_staff.router)
app.include_router(get_totalapplications.router)
app.include_router(post_application.router)
