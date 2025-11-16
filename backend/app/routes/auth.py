from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from typing import Annotated, Dict
from datetime import datetime
from pydantic import BaseModel, EmailStr

from app.models.user import User
from app.database import db
from app.utils.jwt_handler import signJWT, decodeJWT
from bson import ObjectId
from bson.errors import InvalidId

import bcrypt

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

def get_password_hash(password: str) -> str:
    # Encode password to bytes and truncate to 72 bytes
    truncated_password_bytes = password.encode('utf-8')[:72]
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(truncated_password_bytes, salt)
    return hashed_password.decode('utf-8') # Store as utf-8 string

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Encode plain password to bytes and truncate to 72 bytes
    truncated_plain_password_bytes = plain_password.encode('utf-8')[:72]
    # Check if the plain password matches the hashed password
    return bcrypt.checkpw(truncated_plain_password_bytes, hashed_password.encode('utf-8'))

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decodeJWT(token)
    if payload is None:
        raise credentials_exception
    user_id = payload.get("user_id")
    if user_id is None:
        raise credentials_exception
    
    # Convert user_id string to ObjectId for MongoDB query
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
    except InvalidId:
        raise credentials_exception

    if user is None:
        raise credentials_exception
    return user

@router.post("/register", response_description="Register new user")
async def register_user(user_data: UserRegister = Body(...)):
    hashed_password = get_password_hash(user_data.password)
    if db.users.find_one({"email": user_data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password_hash": hashed_password,
        "role": "user",  # Por defecto, usuario normal
        "created_at": datetime.utcnow()
    }
    new_user = db.users.insert_one(new_user_doc)
    created_user = db.users.find_one({"_id": new_user.inserted_id})
    return {"message": "User registered successfully", "user_id": str(created_user["_id"])}

@router.post("/login", response_description="Login user")
async def user_login(user_credentials: Dict[str, str] = Body(...)):
    user = db.users.find_one({"email": user_credentials["email"]})
    if user and verify_password(user_credentials["password"], user["password_hash"]):
        return signJWT(str(user["_id"]))
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.get("/me", response_description="Get current user")
async def get_me(current_user: Annotated[User, Depends(get_current_user)]):
    # Convertir ObjectId a string para la respuesta
    user_dict = dict(current_user)
    user_dict["_id"] = str(user_dict["_id"])
    # Asegurarse que el campo 'role' esté presente
    if "role" not in user_dict:
        user_dict["role"] = "user"
    # Buscar el portafolio asociado al usuario
    portfolio = db.portfolios.find_one({"user_id": user_dict["_id"]})
    if portfolio:
        portfolio["_id"] = str(portfolio["_id"])
        user_dict["portfolio"] = portfolio
    else:
        user_dict["portfolio"] = None
    return user_dict