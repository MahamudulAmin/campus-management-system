from fastapi import APIRouter
import json
import os


router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)


FILE = "data/complaints.json"


def read_json():
    if not os.path.exists(FILE):
        return []

    with open(FILE, "r") as f:
        return json.load(f)


def write_json(data):
    with open(FILE, "w") as f:
        json.dump(data, f, indent=4)

@router.get("/count")
def complaint_count():

    complaints = read_json()

    return {
        "count": len(complaints)
    }

@router.get("/")
def get_complaints():
    return read_json()


@router.post("/")
def create_complaint(complaint: dict):

    complaints = read_json()

    complaints.append(complaint)

    write_json(complaints)

    return {
        "message": "Complaint Created Successfully"
    }