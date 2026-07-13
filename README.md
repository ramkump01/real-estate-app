# Real Estate App - AI Pricing Platform

A full-stack real estate application with OAuth authentication, property listings, and AI-powered price estimation.

## 🏗️ Architecture

**Frontend:** React 18 + TypeScript + Tailwind CSS  
**Backend:** FastAPI (Python) + PostgreSQL  
**AI Integration:** OpenAI GPT-4 for property valuation

## 📋 Features

- ✅ OAuth Login (Google & Microsoft)
- ✅ Create & Manage Property Listings
- ✅ AI-Powered Price Estimation
- ✅ Property Search & Filtering
- ✅ £100 Listing Fee Tracking
- ✅ User Dashboard

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/realestate
SECRET_KEY=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-secret
OPENAI_API_KEY=your-openai-api-key
```

Start PostgreSQL and create database:
```bash
createdb realestate
```

Run server:
```bash
python main.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/google` - Login with Google
- `POST /api/auth/microsoft` - Login with Microsoft
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties/` - List all active properties
- `POST /api/properties/` - Create new property
- `GET /api/properties/{id}` - Get property details
- `PUT /api/properties/{id}` - Update property
- `POST /api/properties/{id}/publish` - Publish listing (£100 fee)
- `DELETE /api/properties/{id}` - Delete property
- `GET /api/properties/my-listings` - Get user's listings

### AI Pricing
- `POST /api/ai/price-estimate` - Generate price estimate
- `GET /api/ai/price-estimate/{property_id}` - Get latest estimate

## 🗄️ Database Schema

### users
- id, email, name, oauth_provider, oauth_id, avatar_url, created_at, updated_at

### properties
- id, owner_id, title, description, address, postcode, city, bedrooms, bathrooms, square_feet, property_type, images, asking_price, listing_fee_paid, status, created_at, updated_at

### price_estimates
- id, property_id, user_id, estimated_price, confidence_score, analysis, created_at

## 🔐 Environment Variables

See `.env.example` files in both backend and frontend directories

## 📦 Technologies

- **Frontend:** React, TypeScript, Tailwind CSS, Zustand, React Router, Axios
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL, PyJWT
- **AI:** OpenAI GPT-4
- **Authentication:** OAuth 2.0 (Google & Microsoft)

## 📝 License

MIT
