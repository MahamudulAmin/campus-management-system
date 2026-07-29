from fastapi import APIRouter
import json


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


USER_FILE = "data/users.json"


def read_users():
    with open(USER_FILE, "r") as f:
        return json.load(f)



@router.get("/")
def get_users():
    return read_users()