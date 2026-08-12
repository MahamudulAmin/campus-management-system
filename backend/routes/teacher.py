from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import os
import json
import uuid


router = APIRouter(
    prefix="/api/teacher",
    tags=["Teacher"]
)


# =========================================================
# FILE PATHS
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

DATA_FOLDER = os.path.join(
    BASE_DIR,
    "data"
)

TEACHER_FILE = os.path.join(
    DATA_FOLDER,
    "teacher.json"
)

TEACHER_REQUEST_FILE = os.path.join(
    DATA_FOLDER,
    "teacher_requests.json"
)

TEACHER_ANNOUNCEMENT_FILE = os.path.join(
    DATA_FOLDER,
    "teacher_ann.json"
)


# =========================================================
# CREATE DATA FOLDER
# =========================================================

os.makedirs(
    DATA_FOLDER,
    exist_ok=True
)


# =========================================================
# JSON FILE HELPER
# =========================================================

def ensure_json_file(file_path: str):

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


ensure_json_file(TEACHER_FILE)
ensure_json_file(TEACHER_REQUEST_FILE)
ensure_json_file(TEACHER_ANNOUNCEMENT_FILE)


# =========================================================
# JSON READ
# =========================================================

def read_json(file_path: str):

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
        json.JSONDecodeError
    ):

        return []


# =========================================================
# JSON WRITE
# =========================================================

def write_json(
    file_path: str,
    data
):

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
# ANNOUNCEMENT MODEL
# =========================================================

class TeacherAnnouncementCreate(BaseModel):

    title: str

    body: str

    category: str = "General"


# =========================================================
# SERVICE REQUEST MODEL
# =========================================================

class TeacherRequestCreate(BaseModel):

    title: str

    category: str

    description: str = ""

    priority: str = "Medium"


# =========================================================
# GET TEACHER ANNOUNCEMENTS
# =========================================================

@router.get("/announcements")
async def get_teacher_announcements(
    user_id: Optional[str] = None
):

    announcements = read_json(
        TEACHER_ANNOUNCEMENT_FILE
    )

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

    announcements.reverse()

    return announcements


# =========================================================
# CREATE TEACHER ANNOUNCEMENT
# =========================================================

@router.post("/announcements")
async def create_teacher_announcement(
    announcement: TeacherAnnouncementCreate,
    user_id: str
):

    if not user_id.strip():

        raise HTTPException(
            status_code=400,
            detail="Teacher ID is required."
        )

    if not announcement.title.strip():

        raise HTTPException(
            status_code=400,
            detail="Announcement title is required."
        )

    if not announcement.body.strip():

        raise HTTPException(
            status_code=400,
            detail="Announcement body is required."
        )

    announcements = read_json(
        TEACHER_ANNOUNCEMENT_FILE
    )

    # =====================================================
    # FIND TEACHER
    # =====================================================

    teachers = read_json(
        TEACHER_FILE
    )

    teacher_name = "Teacher"

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

            teacher_name = (
                teacher.get("name")
                or teacher.get("teacher_name")
                or teacher.get("full_name")
                or "Teacher"
            )

            break

    # =====================================================
    # CREATE ANNOUNCEMENT
    # =====================================================

    new_announcement = {

        "id": str(
            uuid.uuid4()
        ),

        "teacher_id": str(
            user_id
        ),

        "teacher_name": teacher_name,

        "title": announcement.title.strip(),

        "body": announcement.body.strip(),

        "category": (
            announcement.category.strip()
            if announcement.category
            else "General"
        ),

        "created_at":
            datetime.now().isoformat(),

        "status":
            "Published"
    }

    announcements.append(
        new_announcement
    )

    write_json(
        TEACHER_ANNOUNCEMENT_FILE,
        announcements
    )

    return {
        "message":
            "Announcement created successfully.",

        "announcement":
            new_announcement
    }


# =========================================================
# GET TEACHER SERVICE REQUESTS
# =========================================================

@router.get("/requests")
async def get_teacher_requests(
    user_id: Optional[str] = None
):

    requests = read_json(
        TEACHER_REQUEST_FILE
    )

    if user_id:

        requests = [
            request
            for request in requests
            if str(
                request.get(
                    "teacher_id",
                    ""
                )
            ) == str(user_id)
        ]

    requests.reverse()

    return requests


# =========================================================
# CREATE TEACHER SERVICE REQUEST
# =========================================================
#
# POST:
#
# /api/teacher/requests?user_id=1234
#
# =========================================================

@router.post("/requests")
async def create_teacher_request(
    request: TeacherRequestCreate,
    user_id: str
):

    # =====================================================
    # VALIDATE TEACHER ID
    # =====================================================

    if not user_id.strip():

        raise HTTPException(
            status_code=400,
            detail="Teacher ID is required."
        )

    # =====================================================
    # VALIDATE TITLE
    # =====================================================

    if not request.title.strip():

        raise HTTPException(
            status_code=400,
            detail="Request title is required."
        )

    # =====================================================
    # VALIDATE CATEGORY
    # =====================================================

    if not request.category.strip():

        raise HTTPException(
            status_code=400,
            detail="Request category is required."
        )

    # =====================================================
    # VALIDATE PRIORITY
    # =====================================================

    allowed_priorities = [
        "Low",
        "Medium",
        "High"
    ]

    if request.priority not in allowed_priorities:

        raise HTTPException(
            status_code=400,
            detail="Invalid priority."
        )

    # =====================================================
    # READ EXISTING REQUESTS
    # =====================================================

    requests = read_json(
        TEACHER_REQUEST_FILE
    )

    # =====================================================
    # FIND TEACHER NAME
    # =====================================================

    teachers = read_json(
        TEACHER_FILE
    )

    teacher_name = "Teacher"

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

            teacher_name = (
                teacher.get("name")
                or teacher.get("teacher_name")
                or teacher.get("full_name")
                or "Teacher"
            )

            break

    # =====================================================
    # CREATE REQUEST ID
    # =====================================================

    request_id = (
        "REQ-"
        + uuid.uuid4().hex[:8].upper()
    )

    # =====================================================
    # CREATE REQUEST
    # =====================================================

    new_request = {

        "id":
            request_id,

        "teacher_id":
            str(user_id),

        "teacher_name":
            teacher_name,

        "title":
            request.title.strip(),

        "category":
            request.category.strip(),

        "description":
            request.description.strip(),

        "priority":
            request.priority,

        "status":
            "Pending",

        "submitted_at":
            datetime.now().isoformat()
    }

    # =====================================================
    # SAVE REQUEST
    # =====================================================

    requests.append(
        new_request
    )

    write_json(
        TEACHER_REQUEST_FILE,
        requests
    )

    # =====================================================
    # RESPONSE
    # =====================================================

    return {

        "message":
            "Service request submitted successfully.",

        "request":
            new_request
    }


# =========================================================
# DELETE TEACHER SERVICE REQUEST
# =========================================================

@router.delete(
    "/requests/{request_id}"
)
async def delete_teacher_request(
    request_id: str
):

    requests = read_json(
        TEACHER_REQUEST_FILE
    )

    updated_requests = [

        request

        for request in requests

        if str(
            request.get(
                "id",
                ""
            )
        ) != str(request_id)

    ]

    if len(updated_requests) == len(
        requests
    ):

        raise HTTPException(
            status_code=404,
            detail="Service request not found."
        )

    write_json(
        TEACHER_REQUEST_FILE,
        updated_requests
    )

    return {

        "message":
            "Service request deleted successfully."
    }