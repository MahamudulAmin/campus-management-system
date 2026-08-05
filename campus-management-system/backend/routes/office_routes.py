from fastapi import APIRouter, HTTPException
import json


router = APIRouter(
    prefix="/offices",
    tags=["Offices"]
)


OFFICE_FILE = "data/offices.json"
USER_FILE = "data/users.json"



# -------------------------
# Read JSON
# -------------------------

def read_json(file):

    try:
        with open(file, "r") as f:
            return json.load(f)

    except FileNotFoundError:
        return []



# -------------------------
# Write JSON
# -------------------------

def write_json(file, data):

    with open(file, "w") as f:
        json.dump(
            data,
            f,
            indent=4
        )



# -------------------------
# Get Offices
# -------------------------

@router.get("")
def get_offices():

    offices = read_json(OFFICE_FILE)
    users = read_json(USER_FILE)


    result = []


    for office in offices:


        department_users = [
            user
            for user in users
            if user.get("department") == office["name"]
        ]



        # Find Office Head

        head = "Not Assigned"


        for user in department_users:

            if user.get("role") in [
                "Head",
                "Department Head",
                "Office Head"
            ]:

                head = user.get("name")
                break




        # Count staff

        staff_members = [

            user

            for user in department_users

            if user.get("role") in [
                "Staff",
                "Staff Officer",
                "SOD",
                "Officer"
            ]

        ]



        result.append({

            "id": office["id"],

            "name": office["name"],

            "email": office.get(
                "email",
                ""
            ),

            "phone": office.get(
                "phone",
                ""
            ),


            "description": office.get(
                "description",
                ""
            ),


            "status": office.get(
                "status",
                "Active"
            ),


            "head": head,


            "staff": len(staff_members),


            "members": department_users

        })


    return result




# -------------------------
# Add Office
# -------------------------

@router.post("")
def add_office(office: dict):


    offices = read_json(OFFICE_FILE)


    new_id = 1


    if offices:

        new_id = max(
            item["id"]
            for item in offices
        ) + 1



    office["id"] = new_id


    offices.append(office)



    write_json(
        OFFICE_FILE,
        offices
    )


    return {

        "message":"Office Added Successfully",

        "office":office

    }




# -------------------------
# Update Office
# -------------------------

@router.put("/{office_id}")
def update_office(
    office_id:int,
    updated_office:dict
):


    offices = read_json(OFFICE_FILE)



    for office in offices:


        if office["id"] == office_id:


            office["name"] = updated_office.get(
                "name",
                office["name"]
            )


            office["email"] = updated_office.get(
                "email",
                office.get("email","")
            )


            office["phone"] = updated_office.get(
                "phone",
                office.get("phone","")
            )


            office["description"] = updated_office.get(
                "description",
                office.get("description","")
            )


            office["status"] = updated_office.get(
                "status",
                office.get("status","Active")
            )



            write_json(
                OFFICE_FILE,
                offices
            )


            return {

                "message":"Office Updated Successfully",

                "office":office

            }




    raise HTTPException(

        status_code=404,

        detail="Office not found"

    )




# -------------------------
# Delete Office
# -------------------------

@router.delete("/{office_id}")
def delete_office(
    office_id:int
):


    offices = read_json(OFFICE_FILE)



    new_offices = [

        office

        for office in offices

        if office["id"] != office_id

    ]



    if len(new_offices) == len(offices):

        raise HTTPException(

            status_code=404,

            detail="Office not found"

        )



    write_json(

        OFFICE_FILE,

        new_offices

    )



    return {

        "message":"Office Deleted Successfully"

    }