# GenAI (Gemini) QnA Integration

This file documents how to configure and run the GenAI (Gemini) QnA endpoint added to the server.

Environment variables

- `GENAI_MODEL` - model name to use (default `text-bison@001`). Example: `models/gemini-1.0`.
- `GENAI_API_KEY` - optional API key. If provided, the server will use it to authenticate the `@google/genai` client.
- `GOOGLE_APPLICATION_CREDENTIALS` - optional path to service account JSON for Application Default Credentials (ADC). If `GENAI_API_KEY` is not set, ADC will be used.
- `PORT` - server port (default `5000`).

Example `.env` (backend/.env)

GENAI_MODEL=text-bison@001
GENAI_API_KEY=
GOOGLE_APPLICATION_CREDENTIALS=C:\path\to\service-account.json
PORT=5000

Run server (development)

```bash
cd backend
npm install
# In PowerShell, set env var for this session:
# $env:GOOGLE_APPLICATION_CREDENTIALS='C:\path\to\service-account.json'
npm run dev
```

Quick test (curl)

```bash
curl -X POST http://localhost:5000/qna \
  -H "Content-Type: application/json" \
  -d '{"question":"How do I get started with React hooks?","context":"beginner"}'
```

If you encounter errors about client initialization, verify your credentials and SDK version.
