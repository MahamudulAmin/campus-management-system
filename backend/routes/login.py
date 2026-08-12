from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json
import os
import re


router = APIRouter(
    prefix="/login",
    tags=["Login"]
)


# =========================================================
# LOGIN JSON LOCATION
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

DATA_DIR = os.path.join(
    BASE_DIR,
    "data"
)

LOGIN_FILE = os.path.join(
    DATA_DIR,
    "login.json"
)


# =========================================================
# LOGIN REQUEST MODEL
# =========================================================

class LoginRequest(BaseModel):
    id: str
    password: str


# =========================================================
# PROFILE UPDATE MODEL
# =========================================================

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    semester: Optional[str] = None
    gpa: Optional[str] = None
    address: Optional[str] = None


# =========================================================
# MAKE SURE login.json EXISTS
# =========================================================

def ensure_login_file():

    os.makedirs(
        DATA_DIR,
        exist_ok=True
    )

    if not os.path.exists(LOGIN_FILE):

        with open(
            LOGIN_FILE,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                [],
                file,
                indent=4
            )


# =========================================================
# READ login.json
# =========================================================

def read_login_users():

    ensure_login_file()

    try:

        with open(
            LOGIN_FILE,
            "r",
            encoding="utf-8"
        ) as file:

            data = json.load(file)

        if isinstance(data, list):
            return data

        return []

    except json.JSONDecodeError:

        # Reset invalid JSON

        with open(
            LOGIN_FILE,
            "w",
            encoding="utf-8"
        ) as file:

            json.dump(
                [],
                file,
                indent=4
            )

        return []


# =========================================================
# SAVE login.json
# =========================================================

def save_login_users(users):

    ensure_login_file()

    with open(
        LOGIN_FILE,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            users,
            file,
            indent=4,
            ensure_ascii=False
        )

        file.flush()


# =========================================================
# FIND STUDENT
# =========================================================

def find_student(users, student_id):

    for user in users:

        if str(
            user.get("id", "")
        ).strip() == student_id:

            return user

    return None


# =========================================================
# STUDENT LOGIN
# =========================================================

@router.post("/")
def login(login_data: LoginRequest):

    student_id = str(
        login_data.id
    ).strip()

    password = str(
        login_data.password
    ).strip()


    # =====================================================
    # ID VALIDATION
    # =====================================================

    if not re.fullmatch(
        r"\d{7}",
        student_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Student ID must be exactly 7 digits."
        )


    # =====================================================
    # PASSWORD
    # =====================================================
    # Currently password = student ID
    # =====================================================

    if password != student_id:

        raise HTTPException(
            status_code=401,
            detail="Invalid Student ID or password."
        )


    # =====================================================
    # AUTOMATIC EMAIL
    # =====================================================

    email = f"{student_id}@iub.edu.bd"


    # =====================================================
    # READ LOGIN DATA
    # =====================================================

    users = read_login_users()


    # =====================================================
    # FIND EXISTING STUDENT
    # =====================================================

    student = find_student(
        users,
        student_id
    )


    # =====================================================
    # EXISTING STUDENT
    # =====================================================

    if student is not None:

        # Always keep these values correct

        student["id"] = student_id

        student["email"] = email

        student["password"] = student_id

        student["role"] = "Student"


        # Only create name if it doesn't exist

        if not student.get("name"):

            student["name"] = (
                f"Student {student_id}"
            )


        # Make sure profile fields exist

        if "phone" not in student:
            student["phone"] = ""

        if "department" not in student:
            student["department"] = ""

        if "semester" not in student:
            student["semester"] = ""

        if "gpa" not in student:
            student["gpa"] = ""

        if "address" not in student:
            student["address"] = ""


    # =====================================================
    # NEW STUDENT
    # =====================================================

    else:

        student = {
            "id": student_id,
            "name": f"Student {student_id}",
            "email": email,
            "password": student_id,
            "role": "Student",
            "phone": "",
            "department": "",
            "semester": "",
            "gpa": "",
            "address": ""
        }

        users.append(student)


    # =====================================================
    # SAVE LOGIN DATA
    # =====================================================

    save_login_users(users)


    # =====================================================
    # RETURN STUDENT
    # =====================================================

    return {
        "message": "Login successful",
        "user": {
            "id": student["id"],
            "name": student["name"],
            "email": student["email"],
            "role": student["role"],
            "phone": student.get("phone", ""),
            "department": student.get("department", ""),
            "semester": student.get("semester", ""),
            "gpa": student.get("gpa", ""),
            "address": student.get("address", "")
        }
    }


# =========================================================
# GET STUDENT PROFILE
# =========================================================

@router.get("/{student_id}")
def get_profile(student_id: str):

    student_id = str(
        student_id
    ).strip()


    # =====================================================
    # VALIDATE ID
    # =====================================================

    if not re.fullmatch(
        r"\d{7}",
        student_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Student ID must be exactly 7 digits."
        )


    # =====================================================
    # READ USERS
    # =====================================================

    users = read_login_users()


    # =====================================================
    # FIND STUDENT
    # =====================================================

    student = find_student(
        users,
        student_id
    )


    if student is None:

        raise HTTPException(
            status_code=404,
            detail="Student profile not found."
        )


    # =====================================================
    # RETURN PROFILE
    # =====================================================

    return {
        "id": str(
            student.get("id", "")
        ),

        "name": student.get(
            "name",
            ""
        ),

        "email": student.get(
            "email",
            f"{student_id}@iub.edu.bd"
        ),

        "role": student.get(
            "role",
            "Student"
        ),

        "phone": student.get(
            "phone",
            ""
        ),

        "department": student.get(
            "department",
            ""
        ),

        "semester": student.get(
            "semester",
            ""
        ),

        "gpa": student.get(
            "gpa",
            ""
        ),

        "address": student.get(
            "address",
            ""
        )
    }


# =========================================================
# UPDATE STUDENT PROFILE
# =========================================================

@router.put("/{student_id}")
def update_profile(
    student_id: str,
    profile: ProfileUpdate
):

    student_id = str(
        student_id
    ).strip()


    # =====================================================
    # VALIDATE ID
    # =====================================================

    if not re.fullmatch(
        r"\d{7}",
        student_id
    ):

        raise HTTPException(
            status_code=400,
            detail="Student ID must be exactly 7 digits."
        )


    # =====================================================
    # READ USERS
    # =====================================================

    users = read_login_users()


    # =====================================================
    # FIND STUDENT
    # =====================================================

    student = find_student(
        users,
        student_id
    )


    if student is None:

        raise HTTPException(
            status_code=404,
            detail="Student profile not found."
        )


    # =====================================================
    # UPDATE ONLY EDITABLE FIELDS
    # =====================================================

    if profile.name is not None:
        student["name"] = profile.name.strip()

    if profile.phone is not None:
        student["phone"] = profile.phone.strip()

    if profile.department is not None:
        student["department"] = (
            profile.department.strip()
        )

    if profile.semester is not None:
        student["semester"] = (
            profile.semester.strip()
        )

    if profile.gpa is not None:
        student["gpa"] = profile.gpa.strip()

    if profile.address is not None:
        student["address"] = (
            profile.address.strip()
        )


    # =====================================================
    # NEVER ALLOW ID/EMAIL TO BE CHANGED
    # =====================================================

    student["id"] = student_id

    student["email"] = (
        f"{student_id}@iub.edu.bd"
    )

    student["role"] = "Student"


    # =====================================================
    # SAVE
    # =====================================================

    save_login_users(users)


    # =====================================================
    # RETURN UPDATED PROFILE
    # =====================================================

    return {
        "message": "Profile updated successfully",

        "user": {
            "id": student["id"],
            "name": student.get(
                "name",
                ""
            ),
            "email": student["email"],
            "role": student.get(
                "role",
                "Student"
            ),
            "phone": student.get(
                "phone",
                ""
            ),
            "department": student.get(
                "department",
                ""
            ),
            "semester": student.get(
                "semester",
                ""
            ),
            "gpa": student.get(
                "gpa",
                ""
            ),
            "address": student.get(
                "address",
                ""
            )
        }
    }