# Skill Swap App - Complete Project Details

## 📋 Table of Contents
1. Project Overview
2. Architecture
3. Technology Stack
4. Features
5. User Flow
6. Database Structure
7. Backend APIs
8. Frontend Components
9. Deployment
10. Key Functionalities

---

## 🎯 Project Overview

**Skill Swap App** is a peer-to-peer learning platform where users can exchange skills with each other. Instead of paying for courses, users teach skills they know and learn skills they need from others.

### **Problem Solved:**
- Traditional education is expensive
- Professionals have skills but no platform to share them
- Networking based on skills is difficult
- No credibility system for skill verification

### **Solution:**
- Free, community-driven skill exchange
- AI-powered skill verification through MCQ tests
- Credibility scoring (GitHub, LinkedIn, AI tests)
- Real-time chat for teaching/learning
- Review & rating system for transparency

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USERS (Browsers)                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ↓         HTTP/REST         ↓
        ┌──────────────────────────────────────────────┐
        │          FIREBASE HOSTING                     │
        │     (Frontend - React App)                    │
        │  https://skill-swap-e15a9.web.app           │
        └──────────────────────────────────────────────┘
                              ↓
                    ↓         API Calls        ↓
        ┌──────────────────────────────────────────────┐
        │          RAILWAY DEPLOYMENT                   │
        │     (Backend - Express.js Server)            │
        │  https://skillswap-production-04ac.up.railway.app
        │              Port 5000                        │
        └──────────────────────────────────────────────┘
                              ↓
                    ↓         API Keys         ↓
        ┌──────────────────────────────────────────────┐
        │       GOOGLE GENAI (Gemini API)              │
        │     AI Question Generation                    │
        │     Model: gemini-3-flash-preview            │
        └──────────────────────────────────────────────┘
                              ↓
                    ↓      External APIs      ↓
        ┌──────────────────────────────────────────────┐
        │       GITHUB & LINKEDIN APIs                  │
        │     User Credibility Scoring                 │
        └──────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React.js (v19.2.4)
- **Build Tool:** Create React App (react-scripts 5.0.1)
- **Styling:** CSS (App.css)
- **HTTP Client:** Fetch API
- **Deployment:** Firebase Hosting
- **Environment:** Node.js

### **Backend**
- **Runtime:** Node.js (v20)
- **Framework:** Express.js (v5.2.1)
- **File Handling:** Multer (v2.0.2)
- **HTTP Requests:** Axios (v1.13.5)
- **CORS:** CORS middleware (v2.8.6)
- **Environment:** dotenv (v17.3.1)
- **AI Integration:** @google/genai (v1.42.0)
- **Deployment:** Railway.app
- **Container:** Docker (with Dockerfile)

### **APIs & Services**
- **AI:** Google Gemini API (for MCQ generation)
- **User Verification:** GitHub API (repository analysis)
- **User Credibility:** LinkedIn profiles
- **Hosting:** Firebase (Frontend) + Railway (Backend)

### **Database**
- **Type:** In-Memory (Arrays/Objects in Node.js)
- **Structure:**
  - users[] - All registered users
  - chatMessages[] - Chat history
  - ratings[] - User reviews & ratings
  - swapRequests[] - Pending swap requests

---

## ✨ Features

### **1. User Registration & Verification**
- **MCQ Test:** AI-generated questions based on user's skills
- **GitHub Integration:** Analyzes repositories, languages, contributions
- **LinkedIn Integration:** Verifies professional profile
- **BaseMark Calculation:** Combined score from GitHub, LinkedIn, and MCQ

### **2. Skill Matching & Swapping**
- Browse all registered users
- View each user's skills (teach/learn)
- View their credentials and ratings
- Send skill swap requests
- Accept/reject requests

### **3. Real-Time Chat**
- One-to-one messaging between matched users
- Message history
- Auto-refresh for new messages
- Active session tracking

### **4. Review & Rating System**
- 5-star rating with written reviews
- Reviews visible on instructor's profile
- Credits earned from ratings
- Average rating calculation

### **5. Project Showcase**
- Upload multiple project files
- Download projects from other users
- Project metadata (upload date, filename)

### **6. Public Profiles**
- View other users' complete profiles
- See their projects with download option
- View their reviews and ratings
- Check their credibility score

### **7. AI-Powered Q&A**
- Dynamic MCQ generation using Google Gemini
- Context-aware questioning
- Skill verification
- Test results tracking

---

## 👥 User Flow

### **Registration Journey**
```
1. REGISTRATION PAGE
   ↓
2. ENTER SKILLS
   ├─ Skills to Teach
   └─ Skills to Learn
   ↓
3. GENERATE AI TEST
   ├─ AI generates 10 MCQs based on skills
   ├─ User answers questions
   └─ Calculates MCQ Score
   ↓
4. OPTIONAL VERIFICATION
   ├─ GitHub Username → Analyzes repositories
   ├─ LinkedIn URL → Verifies profile
   └─ Calculates scores
   ↓
5. BASEMARK CALCULATION
   ├─ Formula: (GitHub + LinkedIn + MCQ) / 2
   ├─ Range: 0-10
   └─ Displayed for credibility
   ↓
6. PROFILE CREATED
   └─ Ready to browse and swap skills
```

### **Skill Swap Journey**
```
USER A (Wants to teach Python, learn React)
        ↓
     BROWSES USERS
        ↓
   FINDS USER B (Knows React, wants Python)
        ↓
   CLICKS "View Profile"
        ├─ Sees User B's projects
        ├─ Sees User B's reviews
        └─ Sees User B's credentials
        ↓
   CLICKS "Request Swap"
        ├─ Enters: Skill to teach (Python)
        ├─ Enters: Skill to learn (React)
        └─ Sends request
        ↓
   USER B PROFILE
        ├─ Sees pending request
        └─ Clicks "Accept Request"
           ├─ Chat session created
           └─ Both users see "Open Chat"
        ↓
   CHAT & LEARNING
        ├─ Messaging in real-time
        └─ Can rate session afterward
        ↓
   RATING
        ├─ 5-star rating
        ├─ Written review
        └─ Credits earned
        ↓
   REVIEWS APPEAR
        └─ On User B's public profile
```

---

## 💾 Database Structure (In-Memory)

### **Users Collection**
```javascript
{
  id: 1,
  name: "John Doe",
  skillsToTeach: ["Python", "JavaScript"],
  skillsToLearn: ["React", "Docker"],
  
  // Verification
  githubUsername: "johndoe",
  linkedinUrl: "https://linkedin.com/in/johndoe",
  
  // Scores
  githubScore: 4,           // 0-6
  linkedinScore: 2,         // 0-2
  mcqScore: 8,              // 0-10
  baseMark: 7.0,            // (4+2+8)/2
  
  // Engagement
  credits: 15,              // From ratings
  projects: [
    {
      filename: "1234-project.zip",
      originalName: "my-project.zip",
      path: "/uploads/1234-project.zip",
      uploadedAt: "2026-02-21T10:30:00Z"
    }
  ],
  
  // Requests & Sessions
  pendingRequests: [...],
  acceptedSessions: [
    {
      id: 1234567890,
      participants: [1, 2],
      requestId: 9999,
      messages: [],
      createdAt: "2026-02-21T10:00:00Z"
    }
  ],
  
  createdAt: "2026-02-21T09:00:00Z"
}
```

### **Chat Messages Collection**
```javascript
{
  id: 1,
  sessionId: 1234567890,
  fromUserId: 1,
  toUserId: 2,
  message: "Hi! Let's discuss Python best practices",
  timestamp: "2026-02-21T10:30:00Z",
  read: false
}
```

### **Ratings Collection**
```javascript
{
  id: 1,
  fromUserId: 1,
  toUserId: 2,
  sessionId: 1234567890,
  rating: 5,                    // 1-5
  review: "Great teacher! Very helpful and patient",
  createdAt: "2026-02-21T11:00:00Z"
}
```

### **Swap Requests Collection**
```javascript
{
  id: 1645432100000,
  fromUser: { id: 1, name: "John" },
  toUser: { id: 2, name: "Jane" },
  skillOffered: "Python",
  skillRequested: "React",
  status: "pending",            // pending, accepted, rejected
  createdAt: "2026-02-21T10:00:00Z"
}
```

---

## 🔌 Backend APIs

### **Authentication & Users**
```
POST /register
  - Register new user
  - Input: name, skills, GitHub, LinkedIn
  - Output: User object with BaseMark

GET /users
  - Get all registered users (public data)
  - Output: Array of users

GET /users/:id
  - Get specific user profile
  - Output: Complete user object
```

### **Skills & Tests**
```
POST /generate-questions
  - Generate AI MCQ test
  - Input: skills
  - Output: 10 questions with options

POST /submit-test
  - Submit test answers
  - Input: answers array
  - Output: Score, pass/fail status
```

### **Skill Swapping**
```
POST /request-swap
  - Send skill swap request
  - Input: fromUserId, toUserId, skillOffered, skillRequested
  - Output: Request object

POST /accept-swap
  - Accept swap request
  - Input: requestId, userId
  - Output: Chat session created
```

### **Chat**
```
POST /send-message
  - Send chat message
  - Input: sessionId, fromUserId, toUserId, message
  - Output: Message object

GET /chat-messages/:sessionId
  - Fetch chat history
  - Output: Array of messages
```

### **Projects**
```
POST /upload-project
  - Upload project files
  - Input: userId, files (multipart)
  - Output: Project metadata
```

### **Ratings**
```
POST /submit-rating
  - Submit rating & review
  - Input: fromUserId, toUserId, rating, review
  - Output: Rating object + updated credits

GET /user-ratings/:userId
  - Get user's ratings
  - Output: Ratings array, average, total
```

### **AI Q&A**
```
POST /qna
  - Ask Gemini AI questions
  - Input: question, context (optional)
  - Output: Generated answer or MCQ JSON
```

---

## 🎨 Frontend Components

### **Pages/Views**
1. **Home View** - Browse all users
2. **Registration View** - Create account
3. **Profile View** - My profile with sessions & requests
4. **Public Profile View** - View others' profiles
5. **Chat View** - Messaging interface
6. **Rating View** - Leave reviews
7. **Q&A View** - Ask AI questions
8. **Skills Input View** - Enter skills for test

### **Key Components**
```javascript
App.js (Main)
├── fetchUsers()          // Get all users
├── fetchCurrentUserData() // Get my profile
├── handleRegister()      // Register user
├── generateTest()        // Generate MCQ
├── requestSwap()         // Send swap request
├── acceptSwap()          // Accept request
├── openChat()            // Open chat
├── sendMessage()         // Send message
├── submitRating()        // Submit rating
└── submitQnA()           // Ask AI
```

---

## 🚀 Deployment

### **Frontend Deployment (Firebase Hosting)**
- **URL:** https://skill-swap-e15a9.web.app
- **Process:**
  1. Build: `npm run build` (creates optimized production bundle)
  2. Deploy: `firebase deploy --only hosting`
  3. Hosting: Firebase CDN globally distributed
  4. Custom domain: Optional

### **Backend Deployment (Railway)**
- **URL:** https://skillswap-production-04ac.up.railway.app
- **Process:**
  1. Docker containerization (Dockerfile)
  2. Git push to GitHub
  3. Railway auto-deploys from GitHub
  4. Environment variables set in Railway
  5. Auto-restart on crashes
  6. Scaling: Automatic based on load

### **Environment Variables**
```
Backend (.env):
- GENAI_API_KEY = Google Gemini API key
- GENAI_MODEL = Model name (gemini-3-flash-preview)
- PORT = 5000

Frontend (.env.production):
- REACT_APP_API_URL = Backend URL
```

---

## 🔐 Key Functionalities

### **1. Credibility Scoring System**
```
GitHub Score (0-6):
  +2: Has 3+ repositories
  +2: 2+ repos matching taught skills
  +1: Recent activity (< 6 months)
  +1: Repositories with stars

LinkedIn Score (0-2):
  +2: LinkedIn profile verified

MCQ Score (0-10):
  Based on test performance

BaseMark = (GitHub + LinkedIn + MCQ) / 2
Range: 0-10
```

### **2. Real-Time Data Refresh**
- Profile auto-refreshes every 3 seconds
- Pending requests display immediately
- Active sessions update in real-time
- Chat messages stream live

### **3. Duplicate Prevention**
- Chat sessions checked before creating
- No duplicate swap requests between same users
- Prevents multiple accept clicks

### **4. File Uploads & Downloads**
- Multipart form upload
- Files stored locally on server
- Download links provided
- Metadata tracking (size, date, name)

### **5. AI Integration**
- Google Gemini generates dynamic MCQs
- Questions based on user skills
- JSON parsing for structured responses
- Temperature: 0.2 (low randomness for accuracy)

---

## 📊 Statistics & Metrics

### **Scoring System**
- **BaseMark Range:** 0-10
- **Rating Range:** 1-5 stars
- **Credits:** Earned 1 credit per rating point
- **Average Users Can Have:** Unlimited projects
- **Max Chat Sessions:** Unlimited

### **Performance**
- **Frontend Load Time:** ~2-3 seconds
- **API Response:** 200-500ms
- **Chat Message Latency:** <500ms
- **File Upload:** Multipart (5 files max per upload)

---

## 🎓 Learning Outcomes

### **Users Learn:**
1. **New Skills:** From mutual learning
2. **Networking:** Connect with professionals
3. **Teaching:** Improve communication skills
4. **Credibility:** Build reputation through ratings
5. **Collaboration:** Real-time problem solving

### **Platform Provides:**
1. **Verification:** Credible users via GitHub/LinkedIn
2. **Transparency:** Public profiles & reviews
3. **Communication:** Real-time chat
4. **Evidence:** Projects & ratings
5. **Incentives:** Credits system

---

## 🔄 Complete User Journey Example

```
ALICE registers:
  ├─ Skills: Python (teach), React (learn)
  ├─ GitHub repo analysis: Score 5
  ├─ LinkedIn: Score 2
  ├─ MCQ Test: 9/10
  └─ BaseMark: (5+2+9)/2 = 8.0

BOB registers:
  ├─ Skills: React (teach), Python (learn)
  ├─ Credibility similar to Alice
  └─ BaseMark: 7.5

MATCHING:
  Alice browses → Finds Bob
  ├─ Views his profile
  ├─ Sees 3 React projects
  ├─ Sees 4.8/5 star rating
  └─ Clicks "Request Swap"

REQUEST:
  Alice ─→ Offers: Python, Wants: React
          ├─ Request sent to Bob
          └─ Bob sees pending request

ACCEPTANCE:
  Bob accepts
  ├─ Chat session created
  ├─ Both see "Open Chat"
  └─ Real-time messaging begins

TEACHING:
  Bob teaches React to Alice
  ├─ Share code snippets
  ├─ Discuss best practices
  └─ Link to projects for reference

RATING:
  Alice rates Bob: 5 stars
  ├─ Review: "Excellent tutor, very clear explanations"
  ├─ Bob receives 5 credits
  └─ Review appears on Bob's profile

REPUTATION:
  Bob's profile updated:
  ├─ Avg Rating: 4.8→4.85
  ├─ Total Reviews: 4→5
  ├─ Credits: 20→25
  └─ More requests from other users!
```

---

## 📈 Future Enhancements

1. **Database:** Switch to MongoDB for persistence
2. **Real-time:** WebSocket for instant messaging
3. **Notifications:** Push notifications for requests
4. **Video Calls:** Integrate Zoom/Jitsi for live sessions
5. **Payment:** Stripe for premium features
6. **Mobile App:** React Native or Flutter
7. **Translation:** Multi-language support
8. **Analytics:** Track skill trends and user growth
9. **Recommendations:** ML-based skill matching
10. **Verification:** Video identity verification

---

## 🎯 Key Success Metrics

- **User Registration:** Number of users
- **Skill Swap Completion:** Accepted requests
- **Average Rating:** Platform credibility
- **Chat Frequency:** Active engagement
- **Project Uploads:** Learning evidence
- **Retention Rate:** Monthly active users
- **Rating Distribution:** User satisfaction

---

**Project Created:** February 2026  
**Status:** Production Ready ✅  
**Live URL:** https://skill-swap-e15a9.web.app  
**Backend URL:** https://skillswap-production-04ac.up.railway.app
