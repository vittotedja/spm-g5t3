from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import api

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.get_staff.router)
app.include_router(api.get_staff_skill.router)
app.include_router(api.get_staff_role.router)
app.include_router(api.get_staff_id.router)
app.include_router(api.get_staff_role_skill.router)

app.include_router(api.get_role.router)
app.include_router(api.get_role_skill.router)

# app.include_router(create_role_listing.router)

app.include_router(api.get_all_role.router)
app.include_router(api.get_all_skill.router)
app.include_router(api.get_all_region.router)
app.include_router(api.get_all_department.router)

app.include_router(api.get_application.router)
app.include_router(api.update_application.router)
