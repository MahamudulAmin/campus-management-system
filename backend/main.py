from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from routes import complaints
from routes import office_routes
from routes import requests
from routes import user_routes
from routes import offices


from routes import complaints
import json
import os


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

app.include_router(complaints.router)
app.include_router(office_routes.router)
app.include_router(user_routes.router)
app.include_router(requests.router)
app.include_router(offices.router)


# =================================================
# DATA FILES
# =================================================

DATA_FOLDER = "data"

USER_FILE = os.path.join(DATA_FOLDER, "users.json")
OFFICE_FILE = os.path.join(DATA_FOLDER, "offices.json")
REQUEST_FILE = os.path.join(DATA_FOLDER, "requests.json")


os.makedirs(DATA_FOLDER, exist_ok=True)


for file in [
    USER_FILE,
    OFFICE_FILE,
    REQUEST_FILE
]:

    if not os.path.exists(file):
        with open(file, "w") as f:
            json.dump([], f, indent=4)



# =================================================
# JSON HELPERS
# =================================================

def read_json(file):

    try:
        with open(file, "r") as f:
            return json.load(f)

    except:
        return []



def save_json(file, data):

    with open(file, "w") as f:
        json.dump(
            data,
            f,
            indent=4
        )



# =================================================
# HOME
# =================================================

@app.get("/")
def home():

    return {
        "message": "Campus Management System Backend Running Successfully!"
    }



# =================================================
# USER MANAGEMENT
# =================================================


@app.get("/users")
def get_users():

    return read_json(USER_FILE)



@app.post("/users")
def create_user(user: dict):

    users = read_json(USER_FILE)


    new_user = {

        "id": len(users) + 1,

        "name": user.get("name"),

        "email": user.get("email"),

        "role": user.get("role"),

        "department": user.get("department", "")

    }


    users.append(new_user)

    save_json(
        USER_FILE,
        users
    )


    return {
        "message": "User Added Successfully",
        "data": new_user
    }



@app.put("/users/{user_id}")
def update_user(
        user_id:int,
        updated_user:dict
):

    users = read_json(USER_FILE)


    for user in users:

        if user["id"] == user_id:

            user.update(updated_user)

            save_json(
                USER_FILE,
                users
            )


            return {
                "message":"User Updated Successfully",
                "data":user
            }


    raise HTTPException(
        status_code=404,
        detail="User not found"
    )



@app.delete("/users/{user_id}")
def delete_user(user_id:int):

    users = read_json(USER_FILE)


    new_users = [

        user for user in users

        if user["id"] != user_id

    ]


    if len(new_users) == len(users):

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    save_json(
        USER_FILE,
        new_users
    )


    return {
        "message":"User Deleted Successfully"
    }





# =================================================
# REQUEST MANAGEMENT
# =================================================


@app.get("/requests")
def get_requests():

    return read_json(REQUEST_FILE)



@app.post("/requests")
def create_request(request:dict):

    requests = read_json(REQUEST_FILE)


    requests.append(request)


    save_json(
        REQUEST_FILE,
        requests
    )


    return {

        "message":"Request Submitted Successfully",

        "data":request

    }



@app.delete("/requests/{request_id}")
def delete_request(request_id:str):

    requests = read_json(REQUEST_FILE)


    new_requests = [

        r for r in requests

        if r.get("id") != request_id

    ]


    if len(new_requests)==len(requests):

        raise HTTPException(
            status_code=404,
            detail="Request not found"
        )


    save_json(
        REQUEST_FILE,
        new_requests
    )


    return {
        "message":"Request Deleted Successfully"
    }





# =================================================
# OFFICE MANAGEMENT
# =================================================


@app.get("/offices")
def get_offices():

    offices = read_json(OFFICE_FILE)

    users = read_json(USER_FILE)



    for office in offices:


        department_users = [

            user

            for user in users

            if user.get("department")
            ==
            office.get("name")

        ]


        office["staff_count"] = len(
            department_users
        )


        head = next(

            (

                user["name"]

                for user in department_users

                if user.get("role")
                in
                [
                    "Head",
                    "Department Head"
                ]

            ),

            "Not Assigned"

        )


        office["head"] = head



    return offices





@app.post("/offices")
def create_office(office:dict):

    offices = read_json(OFFICE_FILE)


    new_office={

        "id":len(offices)+1,

        "name":office.get("name"),

        "description":
        office.get("description",""),

        "location":
        office.get("location","")

    }


    offices.append(new_office)


    save_json(
        OFFICE_FILE,
        offices
    )


    return {

        "message":"Office Added Successfully",

        "data":new_office

    }




@app.delete("/offices/{office_id}")
def delete_office(office_id:int):

    offices = read_json(OFFICE_FILE)


    new_offices=[

        office

        for office in offices

        if office["id"] != office_id

    ]


    if len(new_offices)==len(offices):

        raise HTTPException(
            status_code=404,
            detail="Office not found"
        )


    save_json(
        OFFICE_FILE,
        new_offices
    )


    return {
        "message":"Office Deleted Successfully"
    }