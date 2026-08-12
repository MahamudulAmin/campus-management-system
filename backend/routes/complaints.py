
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import json
import os


router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)


# =========================================================
# FILES
# =========================================================

DATA_FOLDER = "data"

COMPLAINT_FILE = os.path.join(
    DATA_FOLDER,
    "complaints.json"
)

LOGIN_FILE = os.path.join(
    DATA_FOLDER,
    "login.json"
)


# =========================================================
# MODELS
# =========================================================

class ComplaintCreate(BaseModel):
    student_id: str
    title: str
    description: str
    status: str = "Pending"


class StatusUpdate(BaseModel):
    status: str


# =========================================================
# READ COMPLAINTS
# =========================================================

def read_complaints():

    if not os.path.exists(COMPLAINT_FILE):
        return []

    try:

        with open(
            COMPLAINT_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

        return (
            data
            if isinstance(data, list)
            else []
        )

    except Exception:

        return []


# =========================================================
# WRITE COMPLAINTS
# =========================================================

def write_complaints(data):

    os.makedirs(
        DATA_FOLDER,
        exist_ok=True
    )

    with open(
        COMPLAINT_FILE,
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
# READ LOGIN / STUDENTS
# =========================================================

def read_users():

    if not os.path.exists(LOGIN_FILE):
        return []

    try:

        with open(
            LOGIN_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

        return (
            data
            if isinstance(data, list)
            else []
        )

    except Exception:

        return []


# =========================================================
# GENERATE COMPLAINT ID
# =========================================================

def generate_complaint_id(
    complaints
):

    highest_number = 0

    for complaint in complaints:

        complaint_id = complaint.get(
            "id"
        )

        if not complaint_id:
            continue

        try:

            if str(
                complaint_id
            ).startswith("COMP-"):

                number = int(
                    str(
                        complaint_id
                    ).replace(
                        "COMP-",
                        ""
                    )
                )

                highest_number = max(
                    highest_number,
                    number
                )

        except ValueError:

            continue

    return (
        f"COMP-{highest_number + 1:04d}"
    )


# =========================================================
# CREATE COMPLAINT
# =========================================================

@router.post("/")
def create_complaint(
    complaint_data: ComplaintCreate
):

    # -----------------------------------------------------
    # Validate status
    # -----------------------------------------------------

    allowed_statuses = [
        "Pending",
        "In Progress",
        "Resolved",
        "Rejected"
    ]

    if (
        complaint_data.status
        not in allowed_statuses
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid complaint status"
        )


    # -----------------------------------------------------
    # Find student in login.json
    # -----------------------------------------------------

    users = read_users()

    student = None

    for user in users:

        user_id = user.get("id")

        if (
            user_id is not None
            and str(user_id)
            == str(
                complaint_data.student_id
            )
        ):

            student = user
            break


    # -----------------------------------------------------
    # Student not found
    # -----------------------------------------------------

    if student is None:

        raise HTTPException(
            status_code=404,
            detail=(
                "Student not found in login.json "
                f"for ID {complaint_data.student_id}"
            )
        )


    # -----------------------------------------------------
    # Read existing complaints
    # -----------------------------------------------------

    complaints = read_complaints()


    # -----------------------------------------------------
    # Generate complaint ID
    # -----------------------------------------------------

    complaint_id = generate_complaint_id(
        complaints
    )


    # -----------------------------------------------------
    # Create complaint
    # -----------------------------------------------------

    new_complaint = {

        "student_id": str(
            student.get("id")
        ),

        "student_name": student.get(
            "name",
            "Unknown Student"
        ),

        "student_email": student.get(
            "email",
            ""
        ),

        "title": complaint_data.title,

        "description":
            complaint_data.description,

        "status":
            complaint_data.status,

        "id": complaint_id,

        "created_at":
            datetime.now().isoformat(),

        "updated_at":
            datetime.now().isoformat()
    }


    # -----------------------------------------------------
    # Save complaint
    # -----------------------------------------------------

    complaints.append(
        new_complaint
    )

    write_complaints(
        complaints
    )


    # -----------------------------------------------------
    # Return created complaint
    # -----------------------------------------------------

    return {
        "message":
            "Complaint submitted successfully",

        "complaint":
            new_complaint
    }


# =========================================================
# GET ALL COMPLAINTS
# =========================================================

@router.get("/")
def get_complaints():

    return read_complaints()


# =========================================================
# UPDATE COMPLAINT STATUS
# =========================================================

@router.put("/{complaint_id}/status")
def update_complaint_status(
    complaint_id: str,
    status_data: StatusUpdate
):

    allowed_statuses = [
        "Pending",
        "In Progress",
        "Resolved",
        "Rejected"
    ]


    # -----------------------------------------------------
    # Validate status
    # -----------------------------------------------------

    if (
        status_data.status
        not in allowed_statuses
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid complaint status"
        )


    # -----------------------------------------------------
    # Read complaints
    # -----------------------------------------------------

    complaints = read_complaints()


    # -----------------------------------------------------
    # Find complaint
    # -----------------------------------------------------

    for complaint in complaints:

        current_id = complaint.get(
            "complaint_id",
            complaint.get("id")
        )


        if (
            current_id is not None
            and str(current_id)
            == str(complaint_id)
        ):

            # ---------------------------------------------
            # Update status
            # ---------------------------------------------

            complaint["status"] = (
                status_data.status
            )


            # ---------------------------------------------
            # Update timestamp
            # ---------------------------------------------

            complaint["updated_at"] = (
                datetime.now().isoformat()
            )


            # ---------------------------------------------
            # Save
            # ---------------------------------------------

            write_complaints(
                complaints
            )


            # ---------------------------------------------
            # Return updated complaint
            # ---------------------------------------------

            return {
                "message":
                    "Complaint status updated successfully",

                "complaint":
                    complaint
            }


    # -----------------------------------------------------
    # Complaint not found
    # -----------------------------------------------------

    raise HTTPException(
        status_code=404,
        detail="Complaint not found"
    )

