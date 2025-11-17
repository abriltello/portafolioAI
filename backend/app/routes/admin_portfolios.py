from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Dict, Any
from bson import ObjectId
from app.database import db
from app.models.user import User
from app.models.portfolio import Portfolio
from app.routes.auth import get_current_user, require_admin

router = APIRouter(prefix="/admin/portfolios", tags=["admin-portfolios"])

@router.get("/", response_description="List all portfolios")
async def list_portfolios(current_user: User = Depends(require_admin)):
    portfolios = list(db.portfolios.find())
    for p in portfolios:
        p["_id"] = str(p["_id"])
    return portfolios

@router.get("/{portfolio_id}", response_description="Get portfolio by ID")
async def get_portfolio(portfolio_id: str, current_user: User = Depends(require_admin)):
    portfolio = db.portfolios.find_one({"_id": ObjectId(portfolio_id)})
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    portfolio["_id"] = str(portfolio["_id"])
    return portfolio

@router.delete("/{portfolio_id}", response_description="Delete portfolio")
async def delete_portfolio(portfolio_id: str, current_user: User = Depends(require_admin)):
    result = db.portfolios.delete_one({"_id": ObjectId(portfolio_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return {"message": "Portfolio deleted"}

@router.put("/{portfolio_id}", response_description="Update portfolio")
async def update_portfolio(portfolio_id: str, update_data: Dict[str, Any] = Body(...), current_user: User = Depends(require_admin)):
    result = db.portfolios.update_one({"_id": ObjectId(portfolio_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    updated = db.portfolios.find_one({"_id": ObjectId(portfolio_id)})
    updated["_id"] = str(updated["_id"])
    return updated

@router.get("/user/{user_id}", response_description="Get all portfolios for a user")
async def get_user_portfolios(user_id: str, current_user: User = Depends(require_admin)):
    portfolios = list(db.portfolios.find({"user_id": user_id}))
    for p in portfolios:
        p["_id"] = str(p["_id"])
    return portfolios
