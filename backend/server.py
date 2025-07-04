from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
import os
import bcrypt
import uuid
from datetime import datetime
from typing import Optional

import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.on_event("startup")
async def startup_db_client():
    logger.info("Starting up and connecting to MongoDB.")
    try:
        app.mongodb_client = AsyncIOMotorClient(MONGO_URL)
        app.db = app.mongodb_client.clipboard_app # Use the specific database name
        # The following command will fail if the connection is not established.
        await app.db.command('ping')
        logger.info("Successfully connected to MongoDB.")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        # Depending on the use case, you might want to exit the application
        # For now, we'll just log the error.

@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info("Shutting down MongoDB connection.")
    app.mongodb_client.close()


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Be more specific for security
    allow_credentials=True,
    allow_methods=["*"]
,
    allow_headers=["*"]
)

# MongoDB connection
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017/")
client = AsyncIOMotorClient(MONGO_URL)
db = client.clipboard_app
rooms_collection = db.rooms

# Pydantic models
class RoomCreate(BaseModel):
    password: str

class RoomLogin(BaseModel):
    room_id: str
    password: str

class ClipboardUpdate(BaseModel):
    room_id: str
    text: str

class ClipboardClear(BaseModel):
    room_id: str

# Helper functions
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# API endpoints
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Clipboard API is running"}

@app.post("/api/rooms/create")
async def create_room(room_data: RoomCreate):
    logger.info(f"Attempting to create room.")
    """Create a new room with encrypted password"""
    try:
        room_id = str(uuid.uuid4())
        hashed_password = hash_password(room_data.password)
        
        room_doc = {
            "room_id": room_id,
            "password_hash": hashed_password,
            "clipboard_text": "",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        await rooms_collection.insert_one(room_doc)
        
        return {
            "success": True,
            "room_id": room_id,
            "message": "Room created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create room: {str(e)}")

@app.post("/api/rooms/login")
async def login_room(login_data: RoomLogin):
    logger.info(f"Attempting to login to room: {login_data.room_id}")
    """Login to existing room"""
    try:
        room = await rooms_collection.find_one({"room_id": login_data.room_id})
        
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        if not verify_password(login_data.password, room["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid password")
        
        return {
            "success": True,
            "message": "Login successful",
            "clipboard_text": room.get("clipboard_text", "")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@app.get("/api/rooms/{room_id}/clipboard")
async def get_clipboard(room_id: str):
    logger.info(f"Attempting to get clipboard for room: {room_id}")
    """Get clipboard text for a room"""
    try:
        room = await rooms_collection.find_one({"room_id": room_id})
        
        if not room:
            raise HTTPException(status_code=404, detail="Room not found")
        
        return {
            "success": True,
            "clipboard_text": room.get("clipboard_text", "")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get clipboard: {str(e)}")

@app.post("/api/rooms/clipboard/save")
async def save_clipboard(clipboard_data: ClipboardUpdate):
    logger.info(f"Attempting to save clipboard for room: {clipboard_data.room_id}")
    """Save clipboard text to room"""
    try:
        result = await rooms_collection.update_one(
            {"room_id": clipboard_data.room_id},
            {
                "$set": {
                    "clipboard_text": clipboard_data.text,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Room not found")
        
        return {
            "success": True,
            "message": "Clipboard saved successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save clipboard: {str(e)}")

@app.post("/api/rooms/clipboard/clear")
async def clear_clipboard(clear_data: ClipboardClear):
    logger.info(f"Attempting to clear clipboard for room: {clear_data.room_id}")
    """Clear clipboard text in room"""
    try:
        result = await rooms_collection.update_one(
            {"room_id": clear_data.room_id},
            {
                "$set": {
                    "clipboard_text": "",
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Room not found")
        
        return {
            "success": True,
            "message": "Clipboard cleared successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear clipboard: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)