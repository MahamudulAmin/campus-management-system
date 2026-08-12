from fastapi import APIRouter, HTTPException
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
    os.makedirs(os.path.dirname(REQUEST_FILE), exist_ok=True)

    with open(REQUEST_FILE, "w") as f:
        json.dump(data, f, indent=4)


# =========================
# GET ALL REQUESTS
# =========================
@router.get("/")
def get_requests():
    requests = read_json()
    return requests


# =========================
# CREATE REQUEST
# =========================
@router.post("/")
def create_request(request: dict):
    requests = read_json()

    # Find the highest existing request number
    highest_number = 0

    for existing_request in requests:
        request_id = existing_request.get("id", "")

        if isinstance(request_id, str) and request_id.startswith("REQ-"):
            try:
                number = int(request_id.replace("REQ-", ""))
                highest_number = max(highest_number, number)
            except ValueError:
                pass

    # Generate new request ID
    request_id = f"REQ-{highest_number + 1:04d}"

    request["id"] = request_id
    request["status"] = "Pending"

    requests.append(request)

    write_json(requests)

    return {
        "message": "Request Saved Successfully",
        "request": request
    }


# =========================
# DELETE REQUEST
# =========================
@router.delete("/{request_id}")
def delete_request(request_id: str):
    requests = read_json()

    # Find the request
    request_exists = any(
        request.get("id") == request_id
        for request in requests
    )

    if not request_exists:
        raise HTTPException(
            status_code=404,
            detail=f"Request {request_id} not found"
        )

    # Remove the request
    updated_requests = [
        request
        for request in requests
        if request.get("id") != request_id
    ]

    write_json(updated_requests)

    return {
        "message": "Request deleted successfully",
        "request_id": request_id
    }