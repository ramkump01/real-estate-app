from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional
import httpx
import os
from datetime import datetime, timedelta
from jose import JWTError, jwt

from models import User
from schemas import UserCreate, UserResponse, AuthTokenResponse
from database import get_db

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
MICROSOFT_CLIENT_ID = os.getenv("MICROSOFT_CLIENT_ID")
MICROSOFT_CLIENT_SECRET = os.getenv("MICROSOFT_CLIENT_SECRET")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user

@router.post("/google")
async def google_login(token: str, db: Session = Depends(get_db)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={token}"
            )
            google_user = response.json()
            
        if "error" in google_user:
            raise HTTPException(status_code=401, detail="Invalid Google token")
        
        email = google_user.get("email")
        oauth_id = google_user.get("user_id")
        
        user = db.query(User).filter(User.oauth_id == oauth_id).first()
        
        if not user:
            user = User(
                email=email,
                name=google_user.get("name", email.split("@")[0]),
                oauth_provider="google",
                oauth_id=oauth_id,
                avatar_url=google_user.get("picture"),
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.id}, expires_delta=access_token_expires
        )
        
        return AuthTokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/microsoft")
async def microsoft_login(token: str, db: Session = Depends(get_db)):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://graph.microsoft.com/v1.0/me",
                headers={"Authorization": f"Bearer {token}"},
            )
            microsoft_user = response.json()
        
        if "error" in microsoft_user:
            raise HTTPException(status_code=401, detail="Invalid Microsoft token")
        
        email = microsoft_user.get("userPrincipalName") or microsoft_user.get("mail")
        oauth_id = microsoft_user.get("id")
        
        user = db.query(User).filter(User.oauth_id == oauth_id).first()
        
        if not user:
            user = User(
                email=email,
                name=microsoft_user.get("displayName", email.split("@")[0]),
                oauth_provider="microsoft",
                oauth_id=oauth_id,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.id}, expires_delta=access_token_expires
        )
        
        return AuthTokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse.model_validate(user),
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Logged out successfully"}
