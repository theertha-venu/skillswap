# 🤖 AI SkillSwap Platform 🎯

## Basic Details

### Team Name: [Your Team Name]

### Team Members
- Member 1: [Your Name] - [Your College]
- Member 2: [Team Member Name] - [Their College]

### Hosted Project Link
*Currently running locally at http://localhost:3000*
*(Deployment link will be added after hosting)*

### Project Description
An AI-powered skill swapping platform that verifies user expertise through multi-factor authentication and enables trusted peer-to-peer learning. Users take AI-generated tests, connect GitHub/LinkedIn, upload projects, and exchange skills through a complete request-chat-rating workflow.

### The Problem statement
Online skill-sharing platforms lack trust mechanisms - fake profiles claim false expertise, there's no way to verify authenticity, and genuine learners struggle to find credible teachers.

### The Solution
A multi-factor verification system combining GitHub analysis, LinkedIn confirmation, AI-generated skill tests (10 questions, need 6 correct), and project uploads to calculate a transparent BaseMark credibility score (0-10). Users can confidently swap skills through a complete workflow: Request → Accept → Chat → Rate → Earn Credits.

---

## Technical Details

### Technologies/Components Used

**For Software:**
- **Languages used:** JavaScript (Full Stack)
- **Frameworks used:** React.js (Frontend), Node.js/Express (Backend)
- **Libraries used:** axios (API calls), cors (cross-origin), multer (file uploads), react-hooks (state management)
- **Tools used:** VS Code, Git, GitHub API, Postman, npm, nodemon

---

## Features

- **AI Skill Assessment:** Generates 10 dynamic questions based on user's entered skills (JavaScript, Python, React, etc.), requires 6/10 correct to register
- **Multi-Factor BaseMark Score:** Calculated from GitHub analysis (0-6) + LinkedIn verification (0-2) + AI Test (0-10) + Project uploads (0-2), displayed out of 10
- **Complete Swap Workflow:** Request with teach/learn skills → Accept/Reject → Chat auto-unlocks → 5-star rating with reviews → Credits accumulate
- **Real-Time Chat:** Session-based messaging with history, timestamps, and sent/received styling
- **Professional Profiles:** Skill tags, project showcase, pending requests, active sessions, score breakdown

---

## Implementation

### For Software:

#### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/skill-swap-app.git

# Navigate to project folder
cd skill-swap-app

# Install backend dependencies
cd backend
npm install express cors axios multer nodemon

# Install frontend dependencies
cd ../frontend
npm install
```

#### Run
```bash
# Terminal 1 - Start Backend Server
cd backend
npm run dev
# Server runs on http://localhost:5000

# Terminal 2 - Start Frontend App
cd frontend
npm start
# App opens at http://localhost:3000
```

---

## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

![Screenshot1](<img width="958" height="499" alt="image" src="https://github.com/user-attachments/assets/48a60779-d315-4f55-9de2-e39fd3520aa7" />
<img width="958" height="499" alt="image" src="https://github.com/user-attachments/assets/48a60779-d315-4f55-9de2-e39fd3520aa7" />
)
Home Page
![Screenshot2]()<img width="913" height="436" alt="image" src="https://github.com/user-attachments/assets/95843300-2a34-41c4-a3ab-224bd480f4b1" />
<img width="913" height="436" alt="image" src="https://github.com/user-attachments/assets/95843300-2a34-41c4-a3ab-224bd480f4b1" />

*AI Skill Assessment - 10 dynamic questions generated based on user's entered skills (need 6/10 to pass)*

![Screenshot3](<img width="1395" height="860" alt="image" src="https://github.com/user-attachments/assets/3ece1053-d767-4b25-ad99-2898780240bf" />
<img width="1395" height="860" alt="image" src="https://github.com/user-attachments/assets/3ece1053-d767-4b25-ad99-2898780240bf" />
)
*User Profile - Shows BaseMark breakdown (GitHub 4/6, LinkedIn 2/2, AI Test 7/10, Projects 1/2 = 8.5/10)*



#### Diagrams

**System Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT SIDE                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              React.js Frontend                       │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │    │
│  │  │User Cards│ │AI Test UI│ │  Chat    │ │ Rating │ │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVER SIDE                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Node.js/Express Backend                    │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │    │
│  │  │   Auth   │ │   Test   │ │  Swap    │ │ Chat   │ │    │
│  │  │ Endpoints│ │ Generator│ │ Endpoints│ │ System │ │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              External Integrations                   │    │
│  │  ┌──────────┐ ┌──────────┐ ┌─────────────────────┐ │    │
│  │  │ GitHub   │ │ In-Memory│ │    File Upload     │ │    │
│  │  │   API    │ │ Database │ │    with Multer     │ │    │
│  │  └──────────┘ └──────────┘ └─────────────────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

*Architecture showing React frontend communicating with Node.js backend, which integrates with GitHub API and manages in-memory storage*

**Application Workflow:**

```
┌─────────────┐
│   Home      │
│   Page      │
└──────┬──────┘
       │ Click "Register with AI"
       ▼
┌─────────────┐
│ Enter       │
│ Skills      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ AI Generates│
│ 10 Questions│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Answer      │
│ Questions   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Score ≥ 6/10│───No───→ Try Again
└──────┬──────┘
       │ Yes
       ▼
┌─────────────┐
│ Registration│
│    Form     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Profile    │
│    Page     │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ Browse      │────▶│ Request     │
│ Users       │     │ Swap        │
└─────────────┘     └──────┬──────┘
       │                   │
       │                   ▼
       │            ┌─────────────┐
       │            │ Recipient   │
       └───────────▶│  Accepts    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Chat       │
                    │  Unlocks    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Rate       │
                    │  Session    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Credits    │
                    │  Awarded    │
                    └─────────────┘
```

*Complete user journey from registration through skill assessment to swapping and rating*

---

#### Build Photos

![Team](photos/team-photo.jpg)
*Our development team working on the AI SkillSwap platform*

![Components](photos/components.jpg)
*Key Components: User Card Component, AI Test Interface, Chat System, Rating Module, Profile Dashboard*

![Build](photos/build-process.jpg)
*Build Process: Setting up React frontend, configuring Node.js backend, testing API endpoints with Postman*

![Final](photos/final-product.jpg)
*Final Product Running: Complete application with user cards, AI test, and chat functionality*

---

## Additional Documentation

### API Documentation

**Base URL:** `http://localhost:5000`

##### Endpoints

**GET /test**
- **Description:** Health check endpoint to verify server is running
- **Response:**
```json
{
  "message": "Server is working! 🎉"
}
```

**POST /generate-questions**
- **Description:** Generates 10 AI-powered questions based on user's skills
- **Request Body:**
```json
{
  "skills": "JavaScript, Python, React"
}
```
- **Response:**
```json
{
  "sessionId": "1234567890",
  "questions": [
    {
      "id": 1,
      "question": "What is JavaScript primarily used for?",
      "options": ["Web Development", "Mobile Apps", "Desktop Apps", "All of the above"]
    }
  ]
}
```

**POST /check-mcq**
- **Description:** Validates test answers and returns pass/fail result
- **Request Body:**
```json
{
  "answers": [0, 1, 2, 0, 1, 2, 3, 0, 1, 2]
}
```
- **Response:**
```json
{
  "passed": true,
  "correctCount": 7,
  "totalQuestions": 10,
  "message": "✅ You passed! You can now register."
}
```

**POST /register**
- **Description:** Creates new user account with all profile data
- **Request Body:**
```json
{
  "name": "John Doe",
  "skillsToTeach": "JavaScript, React",
  "skillsToLearn": "Python, Node.js",
  "githubUsername": "johndoe",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "mcqScore": 7
}
```
- **Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "baseMark": "8.2",
  "credits": 0,
  "skillsToTeach": ["JavaScript", "React"],
  "skillsToLearn": ["Python", "Node.js"]
}
```

**POST /upload-project**
- **Description:** Uploads project files for user portfolio
- **Request Body:** multipart/form-data with files
- **Response:**
```json
{
  "message": "Projects uploaded successfully!",
  "projects": [
    {
      "filename": "1234567890-project.zip",
      "originalName": "my-project.zip",
      "path": "/uploads/1234567890-project.zip"
    }
  ]
}
```

**POST /request-swap**
- **Description:** Sends skill swap request to another user
- **Request Body:**
```json
{
  "fromUserId": 1,
  "toUserId": 2,
  "skillOffered": "JavaScript",
  "skillRequested": "Python"
}
```
- **Response:**
```json
{
  "message": "Swap request sent!",
  "request": {
    "id": 12345,
    "status": "pending"
  }
}
```

**POST /accept-swap**
- **Description:** Accepts pending swap request and creates chat session
- **Request Body:**
```json
{
  "requestId": 12345,
  "userId": 2
}
```
- **Response:**
```json
{
  "message": "Request accepted! Chat is now available.",
  "chatSession": {
    "id": 67890,
    "participants": [1, 2]
  }
}
```

**POST /send-message**
- **Description:** Sends chat message in active session
- **Request Body:**
```json
{
  "sessionId": 67890,
  "fromUserId": 1,
  "toUserId": 2,
  "message": "Hi, ready to start our session?"
}
```
- **Response:**
```json
{
  "message": "Message sent!",
  "chatMessage": {
    "id": 11111,
    "message": "Hi, ready to start our session?",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

**GET /chat-messages/:sessionId**
- **Description:** Fetches all messages for a specific session
- **Response:**
```json
[
  {
    "id": 11111,
    "fromUserId": 1,
    "message": "Hi, ready?",
    "timestamp": "2024-01-01T12:00:00Z"
  }
]
```

**POST /submit-rating**
- **Description:** Rates completed session and awards credits
- **Request Body:**
```json
{
  "fromUserId": 2,
  "toUserId": 1,
  "sessionId": 67890,
  "rating": 5,
  "review": "Great teacher, very helpful!"
}
```
- **Response:**
```json
{
  "message": "Rating submitted!",
  "updatedCredits": 15
}
```

**GET /users**
- **Description:** Fetches all registered users with public profiles
- **Response:** Array of user objects with id, name, skills, baseMark, credits

**GET /users/:id**
- **Description:** Fetches single user by ID with complete profile

---

## Project Demo

### Video
[Add your demo video link here - YouTube, Google Drive, etc.]

*Demo video showing: Registration process → AI test (entering skills, answering 10 questions, passing with 7/10) → Profile creation → Browsing users → Sending swap request → Accepting → Chatting → 5-star rating with review → Credits updating*

### Additional Demos
**Live Demo:** http://localhost:3000 (local)
**GitHub Repository:** [Add your GitHub repo link]

---

## AI Tools Used (Optional - For Transparency Bonus)

**Tool Used:** GitHub Copilot, ChatGPT

**Purpose:**
- Generated React component boilerplate code for user cards and forms
- Debugging assistance for async API calls and state management
- Code review and optimization suggestions for scoring algorithms
- API endpoint structure recommendations

**Key Prompts Used:**
- "Create a React component for a 5-star rating system with hover effects and state management"
- "Debug this async function that's not waiting for GitHub API response"
- "Generate 10 multiple choice questions about JavaScript, Python, and React for beginners"
- "Optimize this BaseMark scoring algorithm for better performance"

**Percentage of AI-generated code:** Approximately 20%

**Human Contributions:**
- System architecture design and planning
- Custom scoring algorithm implementation (BaseMark calculation)
- GitHub API integration logic
- UI/UX design decisions and responsive styling
- Testing and debugging
- Database schema design
- Chat system implementation

---

## Team Contributions

- **[Your Name]:** Full-stack development, API design, GitHub integration, AI question algorithm, React components, chat system implementation, rating system, documentation

- **[Team Member 2]:** [Their contributions - e.g., UI/UX design, testing, frontend components, presentation]

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

**MIT License** - Permissive, widely used for open source projects allowing commercial use, modification, and distribution with attribution.
