# Complete Deployment Setup

## Current Status
✅ Frontend built and deployed to Firebase Hosting
✅ Backend code ready for Cloud Run
⏳ Need to deploy backend

## What You Need to Deploy Backend

### Option 1: Firebase Cloud Hosting API (Simple)
Since your frontend is already on Firebase, you can also use Firebase Rewrite rules to proxy API calls.

**Pros:** No additional infrastructure
**Cons:** Limited for file uploads

### Option 2: Google Cloud Run (Recommended) 
Your Express server with file uploads works perfectly on Cloud Run.

**Setup Steps:**

1. **Install Google Cloud SDK**
   - Windows: https://cloud.google.com/sdk/docs/install
   - After installation, restart your terminal
   - Run: `gcloud init`
   - Select project: `skill-swap-e15a9`

2. **Install Docker**
   - Download from: https://www.docker.com/products/docker-desktop
   - After installation, restart your terminal

3. **Deploy Backend**
   ```bash
   cd backend
   gcloud run deploy skill-swap-backend --source . --platform managed --region us-central1 --allow-unauthenticated
   ```

4. **Note the URL** (e.g., `https://skill-swap-backend-xxxxx.run.app`)

5. **Update Frontend API URL**
   ```bash
   # In frontend/.env.production
   REACT_APP_API_URL=https://your-cloud-run-url
   ```

6. **Rebuild and Deploy Frontend**
   ```bash
   npm --prefix frontend run build
   firebase deploy --only hosting
   ```

## Quick Start - Simplest Option

Use Firebase Rewrite instead:

1. Update firebase.json with:
```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "skill-swap-backend",
          "region": "us-central1"
        }
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Current Artifacts
- ✅ Frontend: https://skill-swap-e15a9.web.app
- Frontend API Config: Updated to use environment variable
- Backend: Ready for Cloud Run deployment

## Next: Tell me your preference for backend deployment
