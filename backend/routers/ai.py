from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import openai
import os
import json

from models import User, Property, PriceEstimate
from schemas import PriceEstimateRequest, PriceEstimateResponse
from database import get_db
from routers.auth import get_current_user

router = APIRouter()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

def generate_price_estimate(property_data: dict) -> dict:
    """Generate AI price estimate using OpenAI GPT-4"""
    
    prompt = f"""
    Analyze the following UK property details and provide a realistic price estimate:
    
    Title: {property_data.get('title')}
    Address: {property_data.get('address')}, {property_data.get('city')}, {property_data.get('postcode')}
    Type: {property_data.get('property_type')}
    Bedrooms: {property_data.get('bedrooms')}
    Bathrooms: {property_data.get('bathrooms')}
    Square Feet: {property_data.get('square_feet')}
    Description: {property_data.get('description')}
    
    Provide a JSON response with:
    {{
        "estimated_price": <estimated price in pounds>,
        "confidence_score": <0-1 confidence level>,
        "analysis": "<brief explanation of the estimate>"
    }}
    
    Consider UK property market trends, location, property condition based on description, and size.
    """
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a UK real estate valuation expert. Always respond with valid JSON."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
        )
        
        result_text = response.choices[0].message.content
        result = json.loads(result_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI estimation failed: {str(e)}")

@router.post("/price-estimate", response_model=PriceEstimateResponse)
async def get_price_estimate(
    request: PriceEstimateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    property_obj = db.query(Property).filter(Property.id == request.property_id).first()
    
    if not property_obj:
        raise HTTPException(status_code=404, detail="Property not found")
    
    property_data = {
        "title": property_obj.title,
        "address": property_obj.address,
        "city": property_obj.city,
        "postcode": property_obj.postcode,
        "property_type": property_obj.property_type,
        "bedrooms": property_obj.bedrooms,
        "bathrooms": property_obj.bathrooms,
        "square_feet": property_obj.square_feet,
        "description": property_obj.description,
    }
    
    estimate_result = generate_price_estimate(property_data)
    
    price_estimate = PriceEstimate(
        property_id=request.property_id,
        user_id=current_user.id,
        estimated_price=estimate_result["estimated_price"],
        confidence_score=estimate_result["confidence_score"],
        analysis=estimate_result["analysis"],
    )
    
    db.add(price_estimate)
    db.commit()
    db.refresh(price_estimate)
    
    return price_estimate

@router.get("/price-estimate/{property_id}", response_model=PriceEstimateResponse)
async def get_latest_estimate(
    property_id: int,
    db: Session = Depends(get_db),
):
    estimate = (
        db.query(PriceEstimate)
        .filter(PriceEstimate.property_id == property_id)
        .order_by(PriceEstimate.created_at.desc())
        .first()
    )
    
    if not estimate:
        raise HTTPException(status_code=404, detail="No price estimate found for this property")
    
    return estimate
