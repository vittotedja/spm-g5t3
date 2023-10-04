from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import get_staff, get_staff_id, get_role, get_staff_skill, get_role_skill, get_staff_role_skill, get_staff_application, get_staff_role, get_application, update_application

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
app.include_router(get_staff_application.router)
app.include_router(get_application.router)
app.include_router(update_application.router)