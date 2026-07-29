from fastapi import APIRouter, HTTPException
import json


router = APIRouter(
    prefix="/offices",
    tags=["Offices"]
)


FILE="data/offices.json"



def read_json():

    with open(FILE,"r") as f:
        return json.load(f)



def write_json(data):

    with open(FILE,"w") as f:
        json.dump(data,f,indent=4)



# GET

@router.get("/")
def get_offices():

    return read_json()



# ADD

@router.post("/")
def add_office(office:dict):

    offices=read_json()

    office["id"]=len(offices)+1

    offices.append(office)

    write_json(offices)

    return {
        "message":"Office Added"
    }



# EDIT

@router.put("/{id}")
def edit_office(id:int, office:dict):

    offices=read_json()


    for item in offices:

        if item["id"]==id:

            item.update(office)

            write_json(offices)

            return {
                "message":"Updated"
            }


    raise HTTPException(
        404,
        "Office not found"
    )



# DELETE

@router.delete("/{id}")
def delete_office(id:int):

    offices=read_json()


    offices=[
        x for x in offices
        if x["id"]!=id
    ]


    write_json(offices)


    return {
        "message":"Deleted"
    }