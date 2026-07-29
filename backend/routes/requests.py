from fastapi import APIRouter
import json
import os

router = APIRouter(
    prefix="/requests",
    tags=["Requests"]
)

REQUEST_FILE = "data/requests.json"


def read_json():
    if not os.path.exists(REQUEST_FILE):
        return []

    with open(REQUEST_FILE, "r") as f:
        return json.load(f)


def write_json(data):
    with open(REQUEST_FILE, "w") as f:
        json.dump(data, f, indent=4)


@router.get("/")
def get_requests():

    requests = read_json()

    return requests


@router.post("/")
def create_request(request: dict):

    requests = read_json()

    # Generate request ID
    request_id = f"REQ-{len(requests) + 1:04d}"

    request["id"] = request_id
    request["status"] = "Pending"

    requests.append(request)

    write_json(requests)

    return {
        "message": "Request Saved Successfully",
        "request": request
    }