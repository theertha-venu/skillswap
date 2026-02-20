# Cloud Run Deployment Guide

## Prerequisites
- Google Cloud SDK installed and initialized
- Docker installed
- Backend .env file with GENAI_API_KEY set

## Step 1: Set Project ID
```bash
gcloud config set project skill-swap-e15a9
```

## Step 2: Enable Required APIs
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

## Step 3: Deploy Backend to Cloud Run
From the root directory:

```bash
gcloud run deploy skill-swap-backend \
  --source backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GENAI_API_KEY=$(cat backend/.env | grep GENAI_API_KEY | cut -d '=' -f2)
```

Or using Docker directly:
```bash
cd backend
docker build -t gcr.io/skill-swap-e15a9/skill-swap-backend .
gcloud run deploy skill-swap-backend \
  --image gcr.io/skill-swap-e15a9/skill-swap-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 5000
```

## Step 4: Get Backend URL
After deployment, you'll receive a URL like:
```
https://skill-swap-backend-xxxxx-uc.a.run.app
```

## Step 5: Update Frontend with Backend URL
Set this in your frontend environment:
```bash
# Create .env.production
echo "REACT_APP_API_URL=https://your-cloud-run-url" > frontend/.env.production
```

## Step 6: Rebuild & Deploy Frontend
```bash
npm --prefix frontend run build
firebase deploy --only hosting
```

## Environment Variables for Cloud Run
You can also set them in gcloud:
```bash
gcloud run services update skill-swap-backend \
  --update-env-vars GENAI_API_KEY=your_key
```

## Monitoring
```bash
# View logs
gcloud run services describe skill-swap-backend --region us-central1

# Stream logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=skill-swap-backend" --limit 50 --format json
```
