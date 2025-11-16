from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Dict, Any
from bson import ObjectId
from app.database import db
from app.models.user import User
from app.routes.auth import require_admin

router = APIRouter(prefix="/admin/simulations", tags=["admin-simulations"])

@router.get("/", response_description="List all simulations")
async def list_simulations(current_user: User = Depends(require_admin)):
    portfolios = db.portfolios.find({"simulation_history": {"$exists": True, "$ne": None}})
    simulations = []
    for p in portfolios:
        for sim in p.get("simulation_history", []):
            sim_copy = sim.copy()
            sim_copy["portfolio_id"] = str(p["_id"])
            sim_copy["user_id"] = p["user_id"]
            simulations.append(sim_copy)
    return simulations

@router.get("/portfolio/{portfolio_id}", response_description="Get simulations for a portfolio")
async def get_simulations_for_portfolio(portfolio_id: str, current_user: User = Depends(require_admin)):
    portfolio = db.portfolios.find_one({"_id": ObjectId(portfolio_id)})
    if not portfolio or not portfolio.get("simulation_history"):
        raise HTTPException(status_code=404, detail="No simulations found for this portfolio")
    return portfolio["simulation_history"]

@router.delete("/{portfolio_id}/{timestamp}", response_description="Delete a simulation by timestamp")
async def delete_simulation(portfolio_id: str, timestamp: str, current_user: User = Depends(require_admin)):
    result = db.portfolios.update_one(
        {"_id": ObjectId(portfolio_id)},
        {"$pull": {"simulation_history": {"timestamp": timestamp}}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return {"message": "Simulation deleted"}
