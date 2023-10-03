from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import get_staff, get_role, get_staff_skill, get_role_skill, get_staff_role_skill, role, skillmatch, applicants, apply, totalapplications, get_staff_role

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(get_staff.router)
app.include_router(get_role.router)
app.include_router(get_staff_skill.router)
app.include_router(get_role_skill.router)
app.include_router(get_staff_role_skill.router)
app.include_router(role.router)
app.include_router(skillmatch.router)
app.include_router(applicants.router)
app.include_router(apply.router)
app.include_router(totalapplications.router)
app.include_router(get_staff_role.router)
