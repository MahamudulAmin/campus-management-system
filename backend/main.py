from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import os
import json

# =================================================
# ROUTES
# =================================================

from routes import complaints
from routes import office_routes
from routes import requests
from routes import user_routes
from routes import offices
from routes import login


# =================================================
# APP
# =================================================

app = FastAPI(
    title="Campus Management System API"
)


# =================================================
# CORS
# =================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =================================================
# DATA FILE SETUP
# =================================================

DATA_FOLDER = "data"

USER_FILE = os.path.join(
    DATA_FOLDER,
    "users.json"
)

OFFICE_FILE = os.path.join(
    DATA_FOLDER,
    "offices.json"
)

REQUEST_FILE = os.path.join(
    DATA_FOLDER,
    "requests.json"
)

COMPLAINT_FILE = os.path.join(
    DATA_FOLDER,
    "complaints.json"
)


# =================================================
# CREATE DATA FOLDER
# =================================================

os.makedirs(
    DATA_FOLDER,
    exist_ok=True
)


# =================================================
# CREATE JSON FILES IF THEY DON'T EXIST
# =================================================

for file in [
    USER_FILE,
    OFFICE_FILE,
    REQUEST_FILE,
    COMPLAINT_FILE
]:

    if not os.path.exists(file):

        with open(file, "w") as f:

            json.dump(
                [],
                f,
                indent=4
            )


# =================================================
# ROUTERS
# =================================================

# Complaints
app.include_router(
    complaints.router
)


# Office routes
app.include_router(
    office_routes.router
)


# User management
app.include_router(
    user_routes.router
)


# Student requests
app.include_router(
    requests.router
)


# Offices
app.include_router(
    offices.router
)


# Student login
app.include_router(
    login.router
)


# =================================================
# HOME
# =================================================

@app.get("/")
def home():

    return {
        "message":
        "Campus Management System Backend Running Successfully!"
    }