from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import Dict, Any
from bson import ObjectId
from app.database import db
from app.models.user import User
from app.routes.auth import require_admin

router = APIRouter(prefix="/admin/config", tags=["admin-config"])

@router.get("/", response_description="Get system configuration")
async def get_config(current_user: User = Depends(require_admin)):
    config = db.config.find_one()
    if config:
        config["_id"] = str(config["_id"])
    return config or {}

@router.put("/", response_description="Update system configuration")
async def update_config(update_data: Dict[str, Any] = Body(...), current_user: User = Depends(require_admin)):
    config = db.config.find_one()
    if config:
        db.config.update_one({"_id": config["_id"]}, {"$set": update_data})
        updated = db.config.find_one({"_id": config["_id"]})
        updated["_id"] = str(updated["_id"])
        return updated
    else:
        result = db.config.insert_one(update_data)
        update_data["_id"] = str(result.inserted_id)
        return update_data
