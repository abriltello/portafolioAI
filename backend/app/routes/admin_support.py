from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Dict, Any
from bson import ObjectId
from app.database import db
from app.models.user import User
from app.routes.auth import require_admin

router = APIRouter(prefix="/admin/support", tags=["admin-support"])

@router.get("/messages", response_description="List all support messages")
async def list_support_messages(current_user: User = Depends(require_admin)):
    messages = list(db.contact_messages.find())
    for m in messages:
        m["_id"] = str(m["_id"])
    return messages

@router.delete("/messages/{message_id}", response_description="Delete support message")
async def delete_support_message(message_id: str, current_user: User = Depends(require_admin)):
    result = db.contact_messages.delete_one({"_id": ObjectId(message_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Support message deleted"}
