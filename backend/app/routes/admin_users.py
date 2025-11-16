from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Optional
from bson import ObjectId
from app.database import db
from app.models.user import User
from app.routes.auth import get_current_user

router = APIRouter()

def admin_required(current_user):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")

@router.get("/admin/users", response_model=List[User])
async def list_users(current_user: dict = Depends(get_current_user)):
    admin_required(current_user)
    users = list(db.users.find())
    for u in users:
        u["_id"] = str(u["_id"])
    return users

@router.get("/admin/users/{user_id}", response_model=User)
async def get_user(user_id: str, current_user: dict = Depends(get_current_user)):
    admin_required(current_user)
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user["_id"] = str(user["_id"])
    return user

@router.patch("/admin/users/{user_id}")
async def update_user(user_id: str, data: dict = Body(...), current_user: dict = Depends(get_current_user)):
    admin_required(current_user)
    result = db.users.update_one({"_id": ObjectId(user_id)}, {"$set": data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User updated"}

@router.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(get_current_user)):
    admin_required(current_user)
    result = db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}

@router.post("/admin/users/{user_id}/reset-password")
async def reset_password(user_id: str, current_user: dict = Depends(get_current_user)):
    admin_required(current_user)
    # Aquí deberías generar y enviar una nueva contraseña segura
    return {"message": "Password reset (mock)"}

@router.post("/admin/users/{user_id}/block")
async def block_user(user_id: str, current_user: dict = Depends(get_current_user)):
    admin_required(current_user)
    db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"status": "bloqueado"}})
    return {"message": "User blocked"}

@router.post("/admin/users/{user_id}/unblock")
async def unblock_user(user_id: str, current_user: dict = Depends(get_current_user)):
    admin_required(current_user)
    db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"status": "activo"}})
    return {"message": "User unblocked"}

@router.get("/admin/users/{user_id}/activity")
async def user_activity(user_id: str, current_user: dict = Depends(get_current_user)):
    admin_required(current_user)
    # Aquí deberías consultar logs reales
    return {"activity": ["login", "update profile", "generate portfolio"]}
