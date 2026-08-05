from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os


app = FastAPI(
    title="Campus Management System API"
)


# ==========================
# CORS CONFIGURATION
# ==========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================
# DATA FILES
# ==========================

DATA_FOLDER = "data"

USER_FILE = "data/users.json"
OFFICE_FILE = "data/offices.json"


# Create data folder

if not os.path.exists(DATA_FOLDER):
    os.makedirs(DATA_FOLDER)



# Create JSON files

for file in [USER_FILE, OFFICE_FILE]:

    if not os.path.exists(file):

        with open(file, "w") as f:
            json.dump([], f)



# ==========================
# JSON FUNCTIONS
# ==========================

def read_json(file):

    with open(file, "r") as f:
        return json.load(f)



def save_json(file, data):

    with open(file, "w") as f:
        json.dump(data, f, indent=4)



# ==========================
# HOME API
# ==========================

@app.get("/")
def home():

    return {
        "message":
        "Campus Management System Backend Running Successfully!"
    }



# =================================================
# USER MANAGEMENT API
# =================================================


@app.get("/users")
def get_users():

    return read_json(USER_FILE)



@app.post("/users")
def create_user(user: dict):

    users = read_json(USER_FILE)


    new_user = {

        "id": len(users)+1,

        "name": user.get("name"),

        "email": user.get("email"),

        "role": user.get("role"),

        "department": user.get("department","")

    }


    users.append(new_user)

    save_json(USER_FILE, users)


    return {

        "message":"User Added Successfully",

        "data":new_user
    }




@app.put("/users/{user_id}")
def update_user(user_id:int, updated_user:dict):

    users = read_json(USER_FILE)


    for user in users:


        if user["id"] == user_id:


            user.update(updated_user)


            save_json(USER_FILE,users)


            return {

                "message":
                "User Updated Successfully",

                "data":user
            }


    raise HTTPException(
        status_code=404,
        detail="User not found"
    )




@app.delete("/users/{user_id}")
def delete_user(user_id:int):

    users = read_json(USER_FILE)


    updated_users = [

        user for user in users

        if user["id"] != user_id
    ]


    if len(users)==len(updated_users):

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    save_json(USER_FILE,updated_users)


    return {

        "message":
        "User Deleted Successfully"
    }




# =================================================
# OFFICE MANAGEMENT API
# =================================================


@app.get("/offices")
def get_offices():

    offices = read_json(OFFICE_FILE)

    users = read_json(USER_FILE)



    for office in offices:


        # Count staff under office department

        staff = [

            u for u in users

            if u.get("department")
            == office.get("name")
        ]


        office["staff_count"] = len(staff)



        # Find department head

        head = next(

            (
                u["name"]

                for u in staff

                if u.get("role")
                =="Head"

            ),

            "Not Assigned"

        )


        office["head"] = head



    return offices




@app.post("/offices")
def create_office(office:dict):


    offices = read_json(OFFICE_FILE)


    new_office = {


        "id":len(offices)+1,


        "name":
        office.get("name"),


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

        "message":
        "Office Added Successfully",

        "data":
        new_office
    }




@app.put("/offices/{office_id}")
def update_office(
    office_id:int,
    updated_office:dict
):


    offices = read_json(OFFICE_FILE)



    for office in offices:


        if office["id"] == office_id:


            office.update(updated_office)


            save_json(
                OFFICE_FILE,
                offices
            )


            return {

                "message":
                "Office Updated Successfully",

                "data":
                office
            }



    raise HTTPException(

        status_code=404,

        detail="Office not found"

    )





@app.delete("/offices/{office_id}")
def delete_office(office_id:int):


    offices = read_json(OFFICE_FILE)


    updated = [

        o for o in offices

        if o["id"] != office_id

    ]



    if len(offices)==len(updated):

        raise HTTPException(

            status_code=404,

            detail="Office not found"

        )



    save_json(
        OFFICE_FILE,
        updated
    )



    return {

        "message":
        "Office Deleted Successfully"

    }