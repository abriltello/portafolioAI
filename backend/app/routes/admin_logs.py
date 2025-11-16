from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from bson import ObjectId
from app.database import db
from app.models.user import User
from app.routes.auth import require_admin

router = APIRouter(prefix="/admin/logs", tags=["admin-logs"])

@router.get("/", response_description="List all logs")
async def list_logs(current_user: User = Depends(require_admin)):
    logs = list(db.logs.find())
    for l in logs:
        l["_id"] = str(l["_id"])
    return logs

@router.get("/{log_id}", response_description="Get log by ID")
async def get_log(log_id: str, current_user: User = Depends(require_admin)):
    log = db.logs.find_one({"_id": ObjectId(log_id)})
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    log["_id"] = str(log["_id"])
    return log

@router.delete("/{log_id}", response_description="Delete log")
async def delete_log(log_id: str, current_user: User = Depends(require_admin)):
    result = db.logs.delete_one({"_id": ObjectId(log_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Log not found")
    return {"message": "Log deleted"}
