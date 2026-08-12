from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import json
import os
import uuid

router = APIRouter(
    prefix="/staff",
    tags=["Staff"]
)

REQUEST_FILE = "data/requests.json"
CAMPUS_INFO_FILE = "data/campus_info.json"


# =========================================================
# MODELS
# =========================================================

class StatusUpdate(BaseModel):
    request_id: str
    status: str
    admin_remark: Optional[str] = ""


class CampusInfoCreate(BaseModel):
    title: str
    category: str
    content: str
    location: Optional[str] = ""
    contact: Optional[str] = ""
    created_by: Optional[str] = ""


# =========================================================
# JSON HELPERS
# =========================================================

def ensure_data_files():
    os.makedirs("data", exist_ok=True)

    if not os.path.exists(REQUEST_FILE):
        with open(
            REQUEST_FILE,
            "w",
            encoding="utf-8"
        ) as file:
            json.dump([], file, indent=4)

    if not os.path.exists(CAMPUS_INFO_FILE):
        with open(
            CAMPUS_INFO_FILE,
            "w",
            encoding="utf-8"
        ) as file:
            json.dump([], file, indent=4)


def read_json(file_path):
    ensure_data_files()

    try:
        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as file:
            data = json.load(file)

            return data if isinstance(data, list) else []

    except (
        json.JSONDecodeError,
        FileNotFoundError
    ):
        return []


def write_json(file_path, data):
    ensure_data_files()

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
# SERVICE REQUESTS
# =========================================================

@router.get("/requests")
def get_staff_requests():

    requests = read_json(REQUEST_FILE)

    return requests


# =========================================================
# UPDATE SERVICE REQUEST STATUS
# =========================================================

@router.patch("/requests/status")
def update_request_status(
    request_data: StatusUpdate
):

    requests = read_json(REQUEST_FILE)

    found = False

    for request in requests:

        request_id = str(
            request.get("id", "")
        )

        if request_id == str(
            request_data.request_id
        ):

            request["status"] = (
                request_data.status
            )

            request["admin_remark"] = (
                request_data.admin_remark
            )

            request["updated_at"] = (
                datetime.now().isoformat()
            )

            found = True
            break

    if not found:

        raise HTTPException(
            status_code=404,
            detail="Service request not found"
        )

    write_json(
        REQUEST_FILE,
        requests
    )

    return {
        "message": "Request status updated successfully"
    }


# =========================================================
# CAMPUS INFORMATION
# =========================================================

@router.get("/campus-info")
def get_campus_information():

    campus_info = read_json(
        CAMPUS_INFO_FILE
    )

    return campus_info


# =========================================================
# ADD CAMPUS INFORMATION
# =========================================================

@router.post("/campus-info")
def add_campus_information(
    info: CampusInfoCreate
):

    campus_info = read_json(
        CAMPUS_INFO_FILE
    )

    new_information = {

        "id": str(uuid.uuid4()),

        "title": info.title,

        "category": info.category,

        "content": info.content,

        "location": info.location,

        "contact": info.contact,

        "created_by": info.created_by,

        "created_at":
            datetime.now().isoformat()
    }

    campus_info.insert(
        0,
        new_information
    )

    write_json(
        CAMPUS_INFO_FILE,
        campus_info
    )

    return {
        "message":
            "Campus information added successfully",

        "data":
            new_information
    }


# =========================================================
# DELETE CAMPUS INFORMATION
# =========================================================

@router.delete("/campus-info/{info_id}")
def delete_campus_information(
    info_id: str
):

    campus_info = read_json(
        CAMPUS_INFO_FILE
    )

    original_length = len(
        campus_info
    )

    campus_info = [
        item
        for item in campus_info
        if str(item.get("id")) != str(info_id)
    ]

    if len(campus_info) == original_length:

        raise HTTPException(
            status_code=404,
            detail="Campus information not found"
        )

    write_json(
        CAMPUS_INFO_FILE,
        campus_info
    )

    return {
        "message":
            "Campus information deleted successfully"
    }