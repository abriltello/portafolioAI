from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Dict, Any
from bson import ObjectId
from app.database import db
from app.models.user import User
from app.routes.auth import require_admin

router = APIRouter(prefix="/admin/content", tags=["admin-content"])

@router.get("/", response_description="List all content items")
async def list_content(current_user: User = Depends(require_admin)):
    content = list(db.content.find())
    for c in content:
        c["_id"] = str(c["_id"])
    return content

@router.post("/", response_description="Create content item")
async def create_content(item: Dict[str, Any] = Body(...), current_user: User = Depends(require_admin)):
    result = db.content.insert_one(item)
    item["_id"] = str(result.inserted_id)
    return item

@router.put("/{content_id}", response_description="Update content item")
async def update_content(content_id: str, update_data: Dict[str, Any] = Body(...), current_user: User = Depends(require_admin)):
    result = db.content.update_one({"_id": ObjectId(content_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Content not found")
    updated = db.content.find_one({"_id": ObjectId(content_id)})
    updated["_id"] = str(updated["_id"])
    return updated

@router.delete("/{content_id}", response_description="Delete content item")
async def delete_content(content_id: str, current_user: User = Depends(require_admin)):
    result = db.content.delete_one({"_id": ObjectId(content_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Content not found")
    return {"message": "Content deleted"}
