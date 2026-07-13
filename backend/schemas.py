from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str
    oauth_provider: str
    oauth_id: str
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class PropertyBase(BaseModel):
    title: str
    description: str
    address: str
    postcode: str
    city: str
    country: str = "UK"
    bedrooms: int
    bathrooms: int
    square_feet: float
    property_type: str
    images: Optional[str] = None
    asking_price: Optional[float] = None

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    postcode: Optional[str] = None
    city: Optional[str] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    square_feet: Optional[float] = None
    property_type: Optional[str] = None
    images: Optional[str] = None
    asking_price: Optional[float] = None
    status: Optional[str] = None

class PropertyResponse(PropertyBase):
    id: int
    owner_id: int
    status: str
    listing_fee_paid: bool
    listing_fee_amount: float
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class PriceEstimateRequest(BaseModel):
    property_id: int

class PriceEstimateResponse(BaseModel):
    id: int
    property_id: int
    estimated_price: float
    confidence_score: float
    analysis: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
