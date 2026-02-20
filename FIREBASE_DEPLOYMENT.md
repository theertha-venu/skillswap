# Firebase Deployment Guide for Skill Swap App

## Prerequisites
- Firebase CLI installed ✅
- Google account authenticated ✅
- Firebase project created

## Deployment Steps

### 1. Create Firebase Project (if not already done)
- Visit [Firebase Console](https://console.firebase.google.com/)
- Click "Create Project"
- Name: `skill-swap-app`
- Copy your **Project ID** (looks like: `skill-swap-app-abc123`)

### 2. Update Firebase Configuration
```bash
# Create/update .firebaserc with your project ID
```

### 3. Frontend (Hosting)
The frontend build is ready at `frontend/build/`

### 4. Deploy Frontend
```bash
firebase deploy --only hosting
```

### 5. Backend Options

#### Option A: Firebase Cloud Functions (Simpler, limited)
- Works for basic endpoints
- Limited to 5.4MB
- Your server.js needs refactoring

#### Option B: Cloud Run (Recommended)
- Full Express server support
- File uploads work
- Scales automatically
- Costs per request

#### Option C: External Hosting (Heroku/Railway)
- Most flexible
- Update frontend API URL in App.js

## Environment Variables
Update backend/.env with production values:
```
GENAI_API_KEY=your_key
GENAI_MODEL=gemini-2.5-flash
```

## Next Steps
1. Create Firebase project and note the Project ID
2. Run: `firebase deploy --only hosting` for frontend
3. Choose backend deployment option
