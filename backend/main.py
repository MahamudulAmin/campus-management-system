import os
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import jwt

app = FastAPI(
    title="Smart Campus Management API",
    description="FastAPI Backend for Teacher Dashboard",
    version="1.0.0"
)

# CORS Setup for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "smart_campus_secret_key_123"
ALGORITHM = "HS256"

# MongoDB Async Connection
MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client['smart_campus_db']

users_col = db['teachers']
messages_col = db['office_messages']
requests_col = db['admin_requests']
updates_col = db['campus_updates']


# --- Pydantic Schemas (Data Validation) ---

class LoginRequest(BaseModel):
    user_id: str
    password: str

class MessageCreate(BaseModel):
    office: str
    message: str

class AdminRequestCreate(BaseModel):
    title: str
    category: str


# --- Database Seeding on Startup ---

@app.on_event("startup")
async def seed_default_teachers():
    if await users_col.count_documents({}) == 0:
        teachers = [
            {
                "user_id": "123",
                "name": "Md. Ashraful Amin",
                "password": "pass123",
                "department": "Computer Science & Engineering"
            },
            {
                "user_id": "456",
                "name": "Md. Fahad Monir",
                "password": "pass456",
                "department": "Computer Science & Engineering"
            },
            {
                "user_id": "789",
                "name": "Md. Asif Mahmood",
                "password": "pass789",
                "department": "Computer Science & Engineering"
            }
        ]
        await users_col.insert_many(teachers)


# --- Authentication Dependency ---

async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header is missing!"
        )
    
    try:
        parts = authorization.split(" ")
        if len(parts) != 2 or parts[0].lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token header format!"
            )
        
        token = parts[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload!"
            )
            
        current_user = await users_col.find_one({"user_id": user_id}, {"_id": 0})
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found!"
            )
            
        return current_user

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired!"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is invalid!"
        )


@app.post("/api/login")
async def login(credentials: LoginRequest):
    user = await users_col.find_one({
        "user_id": credentials.user_id,
        "password": credentials.password
    })
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid User ID or Password!"
        )

    token_payload = {
        "user_id": user["user_id"],
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "token": token,
        "user": {
            "name": user["name"],
            "user_id": user["user_id"],
            "department": user["department"]
        }
    }


@app.get("/api/updates")
async def get_updates(current_user: dict = Depends(get_current_user)):
    updates = await updates_col.find({}, {"_id": 0}).to_list(length=100)
    
    if not updates:
        sample_update = {
            "title": "New Campus Navigation Map Released",
            "content": "Building C and Science Complex floor maps updated.",
            "date": datetime.utcnow().strftime("%Y-%m-%d")
        }
        await updates_col.insert_one(sample_update)
        updates = await updates_col.find({}, {"_id": 0}).to_list(length=100)
        
    return updates


@app.get("/api/messages")
async def get_messages(current_user: dict = Depends(get_current_user)):
    messages = await messages_col.find(
        {"teacher_id": current_user["user_id"]}, 
        {"_id": 0}
    ).to_list(length=100)
    return messages


@app.post("/api/messages", status_code=status.HTTP_201_CREATED)
async def create_message(
    payload: MessageCreate, 
    current_user: dict = Depends(get_current_user)
):
    doc = {
        "teacher_id": current_user["user_id"],
        "office": payload.office,
        "message": payload.message,
        "timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M")
    }
    await messages_col.insert_one(doc)
    return {"message": "Message sent successfully!"}


@app.get("/api/requests")
async def get_requests(current_user: dict = Depends(get_current_user)):
    requests_list = await requests_col.find(
        {"teacher_id": current_user["user_id"]}, 
        {"_id": 0}
    ).to_list(length=100)
    return requests_list


@app.post("/api/requests", status_code=status.HTTP_201_CREATED)
async def create_request(
    payload: AdminRequestCreate, 
    current_user: dict = Depends(get_current_user)
):
    doc = {
        "teacher_id": current_user["user_id"],
        "title": payload.title,
        "category": payload.category,
        "status": "Pending",
        "submitted_at": datetime.utcnow().strftime("%Y-%m-%d")
    }
    await requests_col.insert_one(doc)
    return {"message": "Request submitted!"}