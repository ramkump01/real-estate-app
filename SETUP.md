# Real Estate App - Setup Guide

## Prerequisites

- Docker & Docker Compose (OR Node.js 18+ & Python 3.11+)
- PostgreSQL 15+ (if not using Docker)
- OAuth credentials from Google & Microsoft
- OpenAI API key

## 🚀 Quick Start (Docker)

```bash
# Clone/download the project
cd real-estate-app

# Make script executable (on Linux/Mac)
chmod +x start.sh

# Start the app
./start.sh  # Linux/Mac
docker-compose up -d  # Windows
```

Visit http://localhost:5173

## 🛠️ Manual Setup (Without Docker)

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# DATABASE_URL=postgresql://user:password@localhost:5432/realestate
# OPENAI_API_KEY=sk-...
# etc.

# Start PostgreSQL
createdb realestate

# Run migrations (optional for custom setup)
python -c "from models import Base, engine; Base.metadata.create_all(bind=engine)"

# Start server
python main.py
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start dev server
npm run dev
```

## 🔑 OAuth Setup

### Google OAuth

1. Go to https://console.cloud.google.com
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add http://localhost:5173 to authorized origins
6. Copy Client ID & Secret to .env

### Microsoft Azure

1. Go to https://portal.azure.com
2. Azure Active Directory > App registrations > New registration
3. Add http://localhost:5173 as redirect URI
4. Create client secret
5. Copy credentials to .env

## 🔑 OpenAI Setup

1. Visit https://platform.openai.com/api-keys
2. Create API key
3. Add to backend/.env as OPENAI_API_KEY

## 📚 API Documentation

Once running, visit: http://localhost:8000/docs

## 🗄️ Database

The app uses PostgreSQL with SQLAlchemy ORM. Tables are auto-created on first run.

### Manual commands:
```bash
# From backend directory with venv activated
python -c "from models import Base, engine; Base.metadata.create_all(bind=engine)"  # Create
python -c "from models import Base, engine; Base.metadata.drop_all(bind=engine)"   # Drop
```

## ⚙️ Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret (change in production)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `MICROSOFT_CLIENT_ID` - Microsoft OAuth client ID
- `MICROSOFT_CLIENT_SECRET` - Microsoft OAuth secret
- `OPENAI_API_KEY` - OpenAI API key

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:8000/api)
- `VITE_GOOGLE_CLIENT_ID` - Google Client ID for frontend

## 🎯 Features Implemented

✅ Google & Microsoft OAuth Login
✅ Property CRUD operations
✅ AI-powered price estimation (GPT-4)
✅ Property search & filtering
✅ User dashboard
✅ Listing fee tracking (£100)
✅ Responsive UI with Tailwind CSS
✅ PostgreSQL database
✅ FastAPI with auto-docs

## 🚀 Production Deployment

### Using Docker:
```bash
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d
```

### Environment Variables for Production:
- Change SECRET_KEY to a random string
- Use environment variable substitution for all secrets
- Enable HTTPS/SSL
- Configure CORS properly
- Set up database backups
- Monitor API rate limits

## 📞 Troubleshooting

**Port already in use:**
```bash
# Change ports in docker-compose.yml or:
docker-compose down  # Stop all containers
```

**Database connection error:**
- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Ensure database exists: `createdb realestate`

**OAuth not working:**
- Verify credentials in .env
- Check redirect URIs match exactly
- Clear browser cookies and try again

**AI estimation failing:**
- Check OpenAI API key is valid
- Verify account has credits
- Check API usage limits

## 📁 Project Structure

```
real-estate-app/
├── backend/
│   ├── main.py           # FastAPI app
│   ├── models.py         # SQLAlchemy models
│   ├── schemas.py        # Pydantic schemas
│   ├── database.py       # DB connection
│   ├── routers/
│   │   ├── auth.py       # OAuth routes
│   │   ├── properties.py # Property CRUD
│   │   └── ai.py         # AI pricing
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable components
│   │   ├── store/        # Zustand state
│   │   ├── api/          # API client
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

## 📝 License

MIT
