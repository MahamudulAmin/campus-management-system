from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware

import os
import json
from datetime import datetime
from typing import Any, Dict, Optional


# =========================================================
# ROUTES
# =========================================================

from routes import complaints
from routes import office_routes
from routes import requests
from routes import user_routes
from routes import offices
from routes import login

# Teacher and Staff
from routes import teacher
from routes import staff


# =========================================================
# APP
# =========================================================

app = FastAPI(
    title="Campus Management System API",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# BASE DIRECTORY
# =========================================================
#
# This is important.
#
# Instead of:
#
# data/teacher_requests.json
#
# we build the path relative to this main.py file.
#
# This prevents the backend from accidentally reading a
# different data folder depending on where uvicorn starts.
#
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DATA_FOLDER = os.path.join(
    BASE_DIR,
    "data"
)

os.makedirs(
    DATA_FOLDER,
    exist_ok=True
)


# =========================================================
# DATA FILES
# =========================================================

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

TEACHER_FILE = os.path.join(
    DATA_FOLDER,
    "teacher.json"
)

TEACHER_REQUEST_FILE = os.path.join(
    DATA_FOLDER,
    "teacher_requests.json"
)

TEACHER_MESSAGE_FILE = os.path.join(
    DATA_FOLDER,
    "teacher_messages.json"
)

TEACHER_ANN_FILE = os.path.join(
    DATA_FOLDER,
    "teacher_ann.json"
)


# =========================================================
# CREATE JSON FILES IF THEY DON'T EXIST
# =========================================================

DATA_FILES = [
    USER_FILE,
    OFFICE_FILE,
    REQUEST_FILE,
    COMPLAINT_FILE,
    TEACHER_FILE,
    TEACHER_REQUEST_FILE,
    TEACHER_MESSAGE_FILE,
    TEACHER_ANN_FILE
]


for file_path in DATA_FILES:

    if not os.path.exists(file_path):

        with open(
            file_path,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                [],
                file,
                indent=4,
                ensure_ascii=False
            )


# =========================================================
# JSON HELPER FUNCTIONS
# =========================================================

def read_json_file(
    file_path: str
) -> list:

    try:

        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

            if isinstance(data, list):
                return data

            return []

    except (
        FileNotFoundError,
        json.JSONDecodeError,
        OSError
    ):

        return []


def write_json_file(
    file_path: str,
    data: list
) -> None:

    folder = os.path.dirname(file_path)

    if folder:
        os.makedirs(
            folder,
            exist_ok=True
        )

    with open(
        file_path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            data,
            file,
            indent=4,
            ensure_ascii=False
        )


# =========================================================
# ROUTERS
# =========================================================


# ---------------------------------------------------------
# Complaints
# ---------------------------------------------------------

app.include_router(
    complaints.router
)


# ---------------------------------------------------------
# Office Routes
# ---------------------------------------------------------

app.include_router(
    office_routes.router
)


# ---------------------------------------------------------
# User Management
# ---------------------------------------------------------

app.include_router(
    user_routes.router
)


# ---------------------------------------------------------
# Student Requests
# ---------------------------------------------------------

app.include_router(
    requests.router
)


# ---------------------------------------------------------
# Offices
# ---------------------------------------------------------

app.include_router(
    offices.router
)


# ---------------------------------------------------------
# Login
# ---------------------------------------------------------

app.include_router(
    login.router
)


# ---------------------------------------------------------
# Teacher
# ---------------------------------------------------------

app.include_router(
    teacher.router
)


# =========================================================
# TEACHER REQUESTS FOR OFFICE STAFF
# =========================================================
#
# These endpoints directly use:
#
# data/teacher_requests.json
#
# Staff Dashboard:
#
# GET
# http://127.0.0.1:8000/staff/requests
#
# PATCH
# http://127.0.0.1:8000/staff/requests/status
#
# =========================================================


# =========================================================
# GET TEACHER SERVICE REQUESTS
# =========================================================

@app.get(
    "/staff/requests"
)
async def get_staff_teacher_requests():

    requests_data = read_json_file(
        TEACHER_REQUEST_FILE
    )

    normalized_requests = []

    for request in requests_data:

        if not isinstance(request, dict):
            continue

        # -------------------------------------------------
        # ID
        # -------------------------------------------------

        request_id = (
            request.get("id")
            or request.get("request_id")
            or request.get("requestId")
            or ""
        )

        # -------------------------------------------------
        # TEACHER ID
        # -------------------------------------------------

        teacher_id = (
            request.get("teacher_id")
            or request.get("teacherId")
            or request.get("user_id")
            or request.get("userId")
            or ""
        )

        # -------------------------------------------------
        # TEACHER NAME
        # -------------------------------------------------

        teacher_name = (
            request.get("teacher_name")
            or request.get("teacherName")
            or request.get("name")
            or "Unknown Teacher"
        )

        # -------------------------------------------------
        # TITLE
        # -------------------------------------------------

        title = (
            request.get("title")
            or request.get("subject")
            or "Service Request"
        )

        # -------------------------------------------------
        # CATEGORY
        # -------------------------------------------------

        category = (
            request.get("category")
            or "General"
        )

        # -------------------------------------------------
        # DESCRIPTION
        # -------------------------------------------------

        description = (
            request.get("description")
            or request.get("details")
            or request.get("message")
            or ""
        )

        # -------------------------------------------------
        # STATUS
        # -------------------------------------------------

        status = (
            request.get("status")
            or "Pending"
        )

        # -------------------------------------------------
        # REMARK
        # -------------------------------------------------

        admin_remark = (
            request.get("admin_remark")
            or request.get("staff_remark")
            or request.get("remark")
            or ""
        )

        # -------------------------------------------------
        # SUBMITTED TIME
        # -------------------------------------------------

        submitted_at = (
            request.get("submitted_at")
            or request.get("submittedAt")
            or request.get("created_at")
            or request.get("createdAt")
            or ""
        )

        normalized_requests.append({

            "id": str(request_id),

            "teacher_id": str(teacher_id),

            "teacher_name": str(teacher_name),

            "title": str(title),

            "category": str(category),

            "description": str(description),

            "status": str(status),

            "admin_remark": str(admin_remark),

            "submitted_at": str(submitted_at)

        })

    # -----------------------------------------------------
    # Newest requests first
    # -----------------------------------------------------

    normalized_requests.reverse()

    return normalized_requests


# =========================================================
# UPDATE TEACHER REQUEST STATUS
# =========================================================

@app.patch(
    "/staff/requests/status"
)
async def update_staff_teacher_request_status(
    request_data: Dict[str, Any] = Body(...)
):

    request_id = str(
        request_data.get(
            "request_id",
            ""
        )
    ).strip()

    new_status = str(
        request_data.get(
            "status",
            ""
        )
    ).strip()

    admin_remark = str(
        request_data.get(
            "admin_remark",
            ""
        )
    ).strip()

    # -----------------------------------------------------
    # Validate request ID
    # -----------------------------------------------------

    if not request_id:

        raise HTTPException(
            status_code=400,
            detail="Request ID is required."
        )

    # -----------------------------------------------------
    # Validate status
    # -----------------------------------------------------

    if not new_status:

        raise HTTPException(
            status_code=400,
            detail="Status is required."
        )

    # -----------------------------------------------------
    # Allowed statuses
    # -----------------------------------------------------

    allowed_statuses = [
        "Pending",
        "In Progress",
        "Approved",
        "Rejected",
        "Resolved"
    ]

    if new_status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid status. Allowed statuses: "
                + ", ".join(allowed_statuses)
            )
        )

    # -----------------------------------------------------
    # Read teacher requests
    # -----------------------------------------------------

    requests_data = read_json_file(
        TEACHER_REQUEST_FILE
    )

    found = False

    updated_request = None

    # -----------------------------------------------------
    # Find request
    # -----------------------------------------------------

    for request in requests_data:

        if not isinstance(request, dict):
            continue

        current_id = str(
            request.get("id")
            or request.get("request_id")
            or request.get("requestId")
            or ""
        )

        if current_id == request_id:

            # ---------------------------------------------
            # Update status
            # ---------------------------------------------

            request["status"] = new_status

            # ---------------------------------------------
            # Update remark
            # ---------------------------------------------

            request["admin_remark"] = admin_remark

            # ---------------------------------------------
            # Save update time
            # ---------------------------------------------

            request["updated_at"] = (
                datetime.now().isoformat()
            )

            found = True

            updated_request = request

            break

    # -----------------------------------------------------
    # Request not found
    # -----------------------------------------------------

    if not found:

        raise HTTPException(
            status_code=404,
            detail="Teacher service request not found."
        )

    # -----------------------------------------------------
    # Save teacher_requests.json
    # -----------------------------------------------------

    write_json_file(
        TEACHER_REQUEST_FILE,
        requests_data
    )

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {

        "message":
            "Teacher service request updated successfully.",

        "request":
            updated_request
    }


# =========================================================
# DEBUG - TEACHER REQUEST FILE
# =========================================================
#
# This endpoint is useful to confirm that the backend is
# actually reading teacher_requests.json.
#
# Open:
#
# http://127.0.0.1:8000/debug/teacher-requests
#
# =========================================================

@app.get(
    "/debug/teacher-requests"
)
async def debug_teacher_requests():

    requests_data = read_json_file(
        TEACHER_REQUEST_FILE
    )

    return {

        "file":
            TEACHER_REQUEST_FILE,

        "count":
            len(requests_data),

        "requests":
            requests_data
    }


# =========================================================
# OFFICE STAFF ROUTER
# =========================================================
#
# Keep the existing staff router for:
#
# /staff/campus-info
# /api/messages
# and other staff functionality.
#
# The /staff/requests endpoints above are intentionally
# defined before this router so the main.py implementation
# handles teacher_requests.json directly.
#
# =========================================================

app.include_router(
    staff.router
)


# =========================================================
# TEACHER ANNOUNCEMENTS
# =========================================================


# =========================================================
# GET ALL ANNOUNCEMENTS
# =========================================================

@app.get(
    "/api/announcements"
)
async def get_announcements():

    announcements = read_json_file(
        TEACHER_ANN_FILE
    )

    # Newest first
    announcements.reverse()

    return announcements


# =========================================================
# CREATE TEACHER ANNOUNCEMENT
# =========================================================

@app.post(
    "/api/teacher/announcements"
)
async def create_teacher_announcement(
    user_id: str,
    announcement: Dict[str, Any]
):

    # -----------------------------------------------------
    # Validate Teacher ID
    # -----------------------------------------------------

    if not user_id:

        raise HTTPException(
            status_code=400,
            detail="Teacher ID is required."
        )

    # -----------------------------------------------------
    # Read fields
    # -----------------------------------------------------

    title = str(
        announcement.get(
            "title",
            ""
        )
    ).strip()

    body = str(
        announcement.get(
            "body",
            ""
        )
    ).strip()

    category = str(
        announcement.get(
            "category",
            "General"
        )
    ).strip()

    # -----------------------------------------------------
    # Validate title
    # -----------------------------------------------------

    if not title:

        raise HTTPException(
            status_code=400,
            detail="Announcement title is required."
        )

    # -----------------------------------------------------
    # Validate body
    # -----------------------------------------------------

    if not body:

        raise HTTPException(
            status_code=400,
            detail="Announcement body is required."
        )

    # -----------------------------------------------------
    # Read existing announcements
    # -----------------------------------------------------

    announcements = read_json_file(
        TEACHER_ANN_FILE
    )

    # -----------------------------------------------------
    # Find teacher name
    # -----------------------------------------------------

    teacher_name = "Teacher"

    teachers = read_json_file(
        TEACHER_FILE
    )

    for teacher in teachers:

        if not isinstance(
            teacher,
            dict
        ):
            continue

        teacher_id = str(
            teacher.get("id")
            or teacher.get("teacher_id")
            or teacher.get("user_id")
            or ""
        )

        if teacher_id == str(user_id):

            teacher_name = str(
                teacher.get("name")
                or teacher.get("teacher_name")
                or teacher.get("full_name")
                or "Teacher"
            )

            break

    # -----------------------------------------------------
    # Generate unique announcement ID
    # -----------------------------------------------------

    announcement_id = (
        "ANN-"
        + datetime.now().strftime(
            "%Y%m%d%H%M%S%f"
        )
    )

    # -----------------------------------------------------
    # Create announcement
    # -----------------------------------------------------

    new_announcement = {

        "id":
            announcement_id,

        "teacher_id":
            str(user_id),

        "teacher_name":
            teacher_name,

        "title":
            title,

        "body":
            body,

        "category":
            category
            if category
            else "General",

        "created_at":
            datetime.now().isoformat(),

        "status":
            "Published"
    }

    # -----------------------------------------------------
    # Add announcement
    # -----------------------------------------------------

    announcements.append(
        new_announcement
    )

    # -----------------------------------------------------
    # Save
    # -----------------------------------------------------

    write_json_file(
        TEACHER_ANN_FILE,
        announcements
    )

    # -----------------------------------------------------
    # Response
    # -----------------------------------------------------

    return {

        "message":
            "Announcement created successfully.",

        "announcement":
            new_announcement
    }


# =========================================================
# GET TEACHER ANNOUNCEMENTS
# =========================================================

@app.get(
    "/api/teacher/announcements"
)
async def get_teacher_announcements(
    user_id: Optional[str] = None
):

    announcements = read_json_file(
        TEACHER_ANN_FILE
    )

    # -----------------------------------------------------
    # Filter by teacher
    # -----------------------------------------------------

    if user_id:

        announcements = [

            announcement

            for announcement in announcements

            if str(
                announcement.get(
                    "teacher_id",
                    ""
                )
            ) == str(user_id)

        ]

    # -----------------------------------------------------
    # Newest first
    # -----------------------------------------------------

    announcements.reverse()

    return announcements


# =========================================================
# DELETE TEACHER ANNOUNCEMENT
# =========================================================

@app.delete(
    "/api/teacher/announcements/{announcement_id}"
)
async def delete_teacher_announcement(
    announcement_id: str
):

    announcements = read_json_file(
        TEACHER_ANN_FILE
    )

    # -----------------------------------------------------
    # Find and remove
    # -----------------------------------------------------

    updated_announcements = [

        announcement

        for announcement in announcements

        if str(
            announcement.get(
                "id",
                ""
            )
        ) != str(
            announcement_id
        )

    ]

    # -----------------------------------------------------
    # Check if found
    # -----------------------------------------------------

    if len(updated_announcements) == len(
        announcements
    ):

        raise HTTPException(
            status_code=404,
            detail="Announcement not found."
        )

    # -----------------------------------------------------
    # Save
    # -----------------------------------------------------

    write_json_file(
        TEACHER_ANN_FILE,
        updated_announcements
    )

    return {

        "message":
            "Announcement deleted successfully."
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get(
    "/health"
)
def health():

    return {

        "status":
            "ok",

        "message":
            "Campus Management System API is running."
    }


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():

    return {

        "message":
            "Campus Management System Backend Running Successfully!"
    }