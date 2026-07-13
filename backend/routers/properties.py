from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from models import User, Property, PropertyStatus
from schemas import PropertyCreate, PropertyUpdate, PropertyResponse
from database import get_db
from routers.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=PropertyResponse)
async def create_property(
    property_data: PropertyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    property_obj = Property(
        owner_id=current_user.id,
        **property_data.model_dump(),
        status=PropertyStatus.DRAFT,
    )
    db.add(property_obj)
    db.commit()
    db.refresh(property_obj)
    return property_obj

@router.get("/", response_model=List[PropertyResponse])
async def list_properties(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    status: str = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Property).filter(Property.status == PropertyStatus.ACTIVE)
    
    if status:
        try:
            status_enum = PropertyStatus(status)
            query = query.filter(Property.status == status_enum)
        except ValueError:
            pass
    
    return query.offset(skip).limit(limit).all()

@router.get("/my-listings", response_model=List[PropertyResponse])
async def get_my_listings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(Property).filter(Property.owner_id == current_user.id).all()

@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(property_id: int, db: Session = Depends(get_db)):
    property_obj = db.query(Property).filter(Property.id == property_id).first()
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    return property_obj

@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: int,
    property_data: PropertyUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    property_obj = db.query(Property).filter(Property.id == property_id).first()
    
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    
    if property_obj.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only update your own properties",
        )
    
    update_data = property_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(property_obj, field, value)
    
    db.commit()
    db.refresh(property_obj)
    return property_obj

@router.post("/{property_id}/publish")
async def publish_property(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    property_obj = db.query(Property).filter(Property.id == property_id).first()
    
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    
    if property_obj.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only publish your own properties")
    
    if property_obj.status != PropertyStatus.DRAFT:
        raise HTTPException(status_code=400, detail="Property must be in draft status to publish")
    
    property_obj.status = PropertyStatus.ACTIVE
    property_obj.listing_fee_paid = True
    db.commit()
    db.refresh(property_obj)
    
    return {
        "message": "Property published successfully",
        "property": property_obj,
        "listing_fee": 100.0,
    }

@router.delete("/{property_id}")
async def delete_property(
    property_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    property_obj = db.query(Property).filter(Property.id == property_id).first()
    
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    
    if property_obj.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own properties")
    
    db.delete(property_obj)
    db.commit()
    
    return {"message": "Property deleted successfully"}
