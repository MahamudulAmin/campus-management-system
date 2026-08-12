from fastapi import APIRouter, HTTPException
import json
import os
from datetime import datetime


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)





# =================================================
# ABSOLUTE JSON FILE PATH
# =================================================


BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)


DATA_FOLDER = os.path.join(
    BASE_DIR,
    "data"
)


USER_FILE = os.path.join(
    DATA_FOLDER,
    "users.json"
)





# create data folder if not exists

os.makedirs(
    DATA_FOLDER,
    exist_ok=True
)





# create users.json if not exists

if not os.path.exists(USER_FILE):

    with open(USER_FILE,"w") as file:

        json.dump(
            [],
            file,
            indent=4
        )









# =================================================
# READ USERS
# =================================================


def read_users():


    try:

        with open(USER_FILE,"r") as file:

            return json.load(file)


    except:

        return []









# =================================================
# WRITE USERS
# =================================================


def write_users(users):


    with open(USER_FILE,"w") as file:


        json.dump(

            users,

            file,

            indent=4

        )









# =================================================
# GET ALL USERS
# =================================================


@router.get("")
def get_users():

    return read_users()










# =================================================
# ADD USER
# =================================================


@router.post("")
def add_user(user:dict):


    users = read_users()





    # duplicate email check

    for existing in users:


        if existing.get("email") == user.get("email"):


            raise HTTPException(

                status_code=400,

                detail="Email already exists"

            )







    # create new id


    new_id = 1



    if users:


        new_id = max(

            item["id"]

            for item in users

        ) + 1








    new_user = {


        "id": new_id,


        "name": user.get(
            "name",
            ""
        ),



        "email": user.get(
            "email",
            ""
        ),



        "role": user.get(
            "role",
            "Office Staff"
        ),



        "department": user.get(
            "department",
            ""
        ),



        "status": user.get(
            "status",
            "Active"
        ),



        "joinDate":

            datetime.now()
            .strftime("%Y-%m-%d")

    }






    users.append(new_user)



    write_users(users)




    print("====================")
    print("USER SAVED")
    print(new_user)
    print("FILE LOCATION")
    print(USER_FILE)
    print("====================")





    return {


        "message":
        "User added successfully",


        "data":
        new_user

    }









# =================================================
# UPDATE USER
# =================================================


@router.put("/{user_id}")
def update_user(
    user_id:int,
    user:dict
):


    users = read_users()





    for item in users:



        if item["id"] == user_id:




            item["name"] = user.get(

                "name",

                item["name"]

            )



            item["email"] = user.get(

                "email",

                item["email"]

            )



            item["role"] = user.get(

                "role",

                item["role"]

            )



            item["department"] = user.get(

                "department",

                item["department"]

            )



            item["status"] = user.get(

                "status",

                item["status"]

            )






            write_users(users)






            return {


                "message":
                "User updated successfully",


                "data":
                item

            }







    raise HTTPException(

        status_code=404,

        detail="User not found"

    )









# =================================================
# DELETE USER
# =================================================


@router.delete("/{user_id}")
def delete_user(user_id:int):


    users = read_users()





    new_users = [

        user

        for user in users

        if user["id"] != user_id

    ]






    if len(users) == len(new_users):


        raise HTTPException(

            status_code=404,

            detail="User not found"

        )







    write_users(new_users)





    return {


        "message":
        "User deleted successfully"

    }