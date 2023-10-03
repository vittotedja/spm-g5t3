from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import get_staff, get_role, get_staff_skill, get_role_skill, get_staff_role_skill, get_staff_role, get_staff_id, get_current_staff_role

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(get_staff.router)
app.include_router(get_staff_id.router)
app.include_router(get_role.router)
app.include_router(get_staff_skill.router)
app.include_router(get_role_skill.router)
app.include_router(get_staff_role_skill.router)
# app.include_router(create_role_listing)
app.include_router(get_staff_role.router)
