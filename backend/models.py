from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    oauth_provider = Column(String)
    oauth_id = Column(String, unique=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    properties = relationship("Property", back_populates="owner")
    price_estimates = relationship("PriceEstimate", back_populates="user")

class PropertyStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    SOLD = "sold"
    DELISTED = "delisted"

class Property(Base):
    __tablename__ = "properties"
    
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, index=True)
    description = Column(Text)
    address = Column(String, index=True)
    postcode = Column(String)
    city = Column(String)
    country = Column(String, default="UK")
    
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    square_feet = Column(Float)
    property_type = Column(String)
    
    images = Column(String)
    
    asking_price = Column(Float, nullable=True)
    listing_fee_paid = Column(Boolean, default=False)
    listing_fee_amount = Column(Float, default=100.0)
    
    status = Column(SQLEnum(PropertyStatus), default=PropertyStatus.DRAFT)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    owner = relationship("User", back_populates="properties")
    price_estimates = relationship("PriceEstimate", back_populates="property")

class PriceEstimate(Base):
    __tablename__ = "price_estimates"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    
    estimated_price = Column(Float)
    confidence_score = Column(Float)
    analysis = Column(Text)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    property = relationship("Property", back_populates="price_estimates")
    user = relationship("User", back_populates="price_estimates")
