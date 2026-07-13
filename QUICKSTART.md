## 🚀 QUICK START (5 minutes)

### Step 1: Get Credentials
- Google OAuth: https://console.cloud.google.com
- Microsoft OAuth: https://portal.azure.com  
- OpenAI API: https://platform.openai.com/api-keys

### Step 2: Start App
```bash
cd real-estate-app
docker-compose up
```

### Step 3: Configure
Edit `backend/.env` and `frontend/.env` with your credentials

### Step 4: Visit
Frontend: http://localhost:5173  
API Docs: http://localhost:8000/docs

---

## 📱 App Workflow

1. **User Logs In** → OAuth (Google/Microsoft)
2. **Create Listing** → Property form
3. **Publish** → Pay £100 fee (metadata tracked)
4. **Get AI Estimate** → OpenAI GPT-4 valuation
5. **Share Listing** → Public property page

---

## 🎯 Key Features

✅ OAuth2 Authentication  
✅ Property CRUD  
✅ AI Price Estimation  
✅ Search & Filter  
✅ PostgreSQL Database  
✅ Docker Ready  
✅ Fully Responsive  
✅ Production-Ready Code  

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `backend/main.py` | FastAPI app |
| `backend/routers/auth.py` | OAuth login |
| `backend/routers/ai.py` | AI pricing |
| `frontend/src/App.tsx` | React router |
| `docker-compose.yml` | Services config |

---

## 🔐 Environment Variables

```env
# Backend
DATABASE_URL=postgresql://user:pass@localhost/realestate
SECRET_KEY=your-secret
OPENAI_API_KEY=sk-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...

# Frontend
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=...
```

---

## 💡 Pro Tips

- **Hot Reload:** Code changes auto-reload (Docker)
- **API Docs:** Swagger UI at http://localhost:8000/docs
- **Database:** Auto-created on first run
- **Logs:** `docker-compose logs backend/frontend`
- **Reset DB:** `docker-compose down -v`

---

## 🆘 Common Issues

| Problem | Fix |
|---------|-----|
| Port in use | Change in docker-compose.yml |
| OAuth fails | Verify credentials in .env |
| AI returns error | Check OpenAI API key + credits |
| DB won't connect | Ensure `docker-compose up` successful |

---

Ready? Run `docker-compose up` now! 🎉
