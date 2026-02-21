const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Dynamic import for ES module @google/genai
let GoogleGenAI = null;
let genaiClient = null;

// Initialize GenAI client function
async function initializeGenAI() {
    try {
        console.log('Starting GenAI initialization...');
        console.log('GENAI_API_KEY:', process.env.GENAI_API_KEY ? '***SET***' : 'NOT SET');
        console.log('GENAI_MODEL:', process.env.GENAI_MODEL);
        
        // Import the ES module dynamically
        const genaiModule = await import('@google/genai');
        GoogleGenAI = genaiModule.GoogleGenAI;
        console.log('GoogleGenAI imported:', GoogleGenAI ? 'YES' : 'NO');
        
        // Instantiate the GenAI client
        const apiKey = process.env.GENAI_API_KEY || '';
        if (apiKey) {
            genaiClient = new GoogleGenAI({ apiKey });
            console.log('✅ GenAI client initialized successfully. genaiClient:', genaiClient ? typeof genaiClient : 'undefined');
            return true;
        } else {
            console.warn('⚠️ No GENAI_API_KEY provided. GenAI features will not work.');
            return false;
        }
    } catch (err) {
        console.warn('⚠️ GenAI client initialization failed:', err.message);
        console.error('Full error:', err);
        return false;
    }
}

const app = express();

// CORS Configuration for production
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://localhost:5000',
        process.env.FRONTEND_URL || 'https://skill-swap-e15a9.web.app'
    ],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Create uploads folder for projects
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// ========== IN-MEMORY DATABASE ==========
let users = [];
let currentId = 1;
let chatMessages = [];
let ratings = [];
let swapRequests = [];

// ========== AI-POWERED MCQ QUESTIONS ==========
// These are dynamically generated based on user's skills
// For now, we have a base set that will be customized

// ========== API ENDPOINTS ==========

// Test endpoint
app.get('/test', (req, res) => {
    res.json({ message: "Server is working! 🎉" });
});

// GENERATE AI QUESTIONS based on user's skills
app.post('/generate-questions', (req, res) => {
    try {
        const { skills } = req.body;
        const skillList = skills.split(',').map(s => s.trim());
        let questions = [];
        
        // Generate 2 questions for each skill (max 10 total)
        skillList.forEach((skill, idx) => {
            if (questions.length >= 10) return;
            
            // AI-generated questions based on the skill
            const skillQuestions = [
                {
                    id: questions.length + 1,
                    question: `What is the main purpose of ${skill}?`,
                    options: [
                        "Web Development",
                        "Data Analysis",
                        "Mobile Development",
                        "All of the above"
                    ],
                    correct: Math.floor(Math.random() * 4)
                },
                {
                    id: questions.length + 2,
                    question: `Which company created ${skill}?`,
                    options: ["Google", "Microsoft", "Facebook", "OpenAI"],
                    correct: Math.floor(Math.random() * 4)
                },
                {
                    id: questions.length + 3,
                    question: `What is a key feature of ${skill}?`,
                    options: [
                        "Easy to learn",
                        "High performance",
                        "Cross-platform",
                        "Open source"
                    ],
                    correct: Math.floor(Math.random() * 4)
                }
            ];
            
            questions = [...questions, ...skillQuestions.slice(0, 2)];
        });
        
        // If we need more questions, add general AI questions
        while (questions.length < 10) {
            questions.push({
                id: questions.length + 1,
                question: `What does API stand for?`,
                options: [
                    "Application Programming Interface",
                    "Advanced Programming Interface",
                    "Application Process Integration",
                    "Advanced Process Integration"
                ],
                correct: 0
            });
        }
        
        // Limit to 10 questions
        questions = questions.slice(0, 10);
        
        res.json({
            sessionId: Date.now().toString(),
            questions: questions.map(q => ({
                id: q.id,
                question: q.question,
                options: q.options
            }))
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to generate questions" });
    }
});

// SUBMIT AI TEST ANSWERS
app.post('/submit-test', (req, res) => {
    try {
        const { answers } = req.body;
        let correctCount = 0;
        
        // For demo, random scoring
        // In real app, you'd compare with correct answers
        answers.forEach(() => {
            if (Math.random() > 0.3) correctCount++;
        });
        
        const passed = correctCount >= 6;
        
        res.json({
            passed,
            correctCount,
            totalQuestions: 10,
            message: passed ? "✅ You passed! You can now register." : "❌ You need 6/10 correct. Try again!"
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to check answers" });
    }
});

// REGISTER NEW USER
app.post('/register', async (req, res) => {
    try {
        const { 
            name, 
            skillsToTeach, 
            skillsToLearn, 
            githubUsername, 
            linkedinUrl,
            mcqScore 
        } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: "Name is required!" });
        }
        
        // Calculate GitHub score
        let githubScore = 0;
        if (githubUsername) {
            try {
                const response = await axios.get(`https://api.github.com/users/${githubUsername}/repos`);
                const repos = response.data;
                if (repos.length >= 3) githubScore += 2;
                
                const skillArray = skillsToTeach ? skillsToTeach.split(',').map(s => s.trim().toLowerCase()) : [];
                const matchingRepos = repos.filter(repo => 
                    repo.language && skillArray.includes(repo.language.toLowerCase())
                );
                if (matchingRepos.length >= 2) githubScore += 2;
                
                const sixMonthsAgo = new Date();
                sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                const recentRepos = repos.filter(repo => new Date(repo.updated_at) > sixMonthsAgo);
                if (recentRepos.length > 0) githubScore += 1;
                
                const reposWithStars = repos.filter(repo => repo.stargazers_count > 0);
                if (reposWithStars.length > 0) githubScore += 1;
                
                githubScore = Math.min(githubScore, 6);
            } catch (error) {
                console.log("GitHub fetch failed");
            }
        }
        
        // Calculate LinkedIn score
        const linkedinScore = linkedinUrl ? 2 : 0;
        
        // Calculate BaseMark
        const totalScore = (githubScore + linkedinScore + (mcqScore || 0)) / 2;
        const baseMark = Math.min(totalScore, 10).toFixed(1);
        
        // Create new user
        const newUser = {
            id: currentId++,
            name: name,
            skillsToTeach: skillsToTeach ? skillsToTeach.split(',').map(s => s.trim()) : [],
            skillsToLearn: skillsToLearn ? skillsToLearn.split(',').map(s => s.trim()) : [],
            githubUsername: githubUsername || null,
            linkedinUrl: linkedinUrl || null,
            githubScore: githubScore,
            linkedinScore: linkedinScore,
            mcqScore: mcqScore || 0,
            baseMark: baseMark,
            credits: 0,
            projects: [],
            pendingRequests: [],
            acceptedSessions: [],
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Something went wrong!" });
    }
});

// UPLOAD PROJECT FILES
app.post('/upload-project', upload.array('projects', 5), (req, res) => {
    try {
        const { userId } = req.body;
        const files = req.files;
        
        const user = users.find(u => u.id === parseInt(userId));
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }
        
        const projectUrls = files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            path: `/uploads/${file.filename}`,
            uploadedAt: new Date().toISOString()
        }));
        
        user.projects = [...(user.projects || []), ...projectUrls];
        
        res.json({ 
            message: "Projects uploaded successfully!",
            projects: projectUrls
        });
    } catch (error) {
        res.status(500).json({ error: "Upload failed!" });
    }
});

// REQUEST SKILL SWAP
app.post('/request-swap', (req, res) => {
    try {
        const { fromUserId, toUserId, skillOffered, skillRequested } = req.body;
        
        const fromUser = users.find(u => u.id === fromUserId);
        const toUser = users.find(u => u.id === toUserId);
        
        if (!fromUser || !toUser) {
            return res.status(404).json({ error: "User not found!" });
        }
        
        const request = {
            id: Date.now(),
            fromUser: {
                id: fromUser.id,
                name: fromUser.name
            },
            toUser: {
                id: toUser.id,
                name: toUser.name
            },
            skillOffered,
            skillRequested,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        fromUser.sentRequests = fromUser.sentRequests || [];
        toUser.pendingRequests = toUser.pendingRequests || [];
        
        fromUser.sentRequests.push(request);
        toUser.pendingRequests.push(request);
        swapRequests.push(request);
        
        res.json({ 
            message: "Swap request sent!",
            request
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to send request!" });
    }
});

// ACCEPT SWAP REQUEST
app.post('/accept-swap', (req, res) => {
    try {
        const { requestId, userId } = req.body;
        
        const user = users.find(u => u.id === userId);
        if (!user) {
            return res.status(404).json({ error: "User not found!" });
        }
        
        const request = swapRequests.find(r => r.id === requestId);
        if (request) {
            request.status = 'accepted';
            
            // Create chat session
            const chatSession = {
                id: Date.now(),
                participants: [request.fromUser.id, request.toUser.id],
                requestId: request.id,
                messages: [],
                createdAt: new Date().toISOString()
            };
            
            user.acceptedSessions = user.acceptedSessions || [];
            user.acceptedSessions.push(chatSession);
            
            const fromUser = users.find(u => u.id === request.fromUser.id);
            if (fromUser) {
                fromUser.acceptedSessions = fromUser.acceptedSessions || [];
                fromUser.acceptedSessions.push(chatSession);
            }
            
            res.json({ 
                message: "Request accepted! Chat is now available.",
                chatSession
            });
        } else {
            res.status(404).json({ error: "Request not found!" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to accept request!" });
    }
});

// SEND CHAT MESSAGE
app.post('/send-message', (req, res) => {
    try {
        const { sessionId, fromUserId, toUserId, message } = req.body;
        
        const chatMessage = {
            id: Date.now(),
            sessionId,
            fromUserId,
            toUserId,
            message,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        chatMessages.push(chatMessage);
        
        res.json({ 
            message: "Message sent!",
            chatMessage
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to send message!" });
    }
});

// GET CHAT MESSAGES
app.get('/chat-messages/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const messages = chatMessages.filter(m => m.sessionId === parseInt(sessionId));
    res.json(messages);
});

// SUBMIT RATING
app.post('/submit-rating', (req, res) => {
    try {
        const { fromUserId, toUserId, sessionId, rating, review } = req.body;
        
        const newRating = {
            id: ratings.length + 1,
            fromUserId,
            toUserId,
            sessionId,
            rating,
            review,
            createdAt: new Date().toISOString()
        };
        
        ratings.push(newRating);
        
        // Update instructor's credits
        const instructor = users.find(u => u.id === toUserId);
        if (instructor) {
            instructor.credits = (instructor.credits || 0) + rating;
        }
        
        res.json({ 
            message: "Rating submitted!",
            rating: newRating,
            updatedCredits: instructor?.credits
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to submit rating!" });
    }
});

// GET USER RATINGS
app.get('/user-ratings/:userId', (req, res) => {
    const { userId } = req.params;
    const userRatings = ratings.filter(r => r.toUserId === parseInt(userId));
    
    const averageRating = userRatings.length > 0 
        ? userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length 
        : 0;
    
    res.json({
        ratings: userRatings,
        totalRatings: userRatings.length,
        averageRating: averageRating.toFixed(1),
        totalCredits: userRatings.reduce((sum, r) => sum + r.rating, 0)
    });
});

// GET ALL USERS
app.get('/users', (req, res) => {
    const publicUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        skillsToTeach: user.skillsToTeach,
        skillsToLearn: user.skillsToLearn,
        githubUsername: user.githubUsername,
        linkedinUrl: user.linkedinUrl,
        githubScore: user.githubScore || 0,
        linkedinScore: user.linkedinScore || 0,
        mcqScore: user.mcqScore || 0,
        baseMark: user.baseMark || 0,
        credits: user.credits || 0,
        projects: user.projects || [],
        pendingRequests: user.pendingRequests || [],
        acceptedSessions: user.acceptedSessions || [],
        averageRating: ratings.filter(r => r.toUserId === user.id).reduce((sum, r) => sum + r.rating, 0) / 
                      (ratings.filter(r => r.toUserId === user.id).length || 1)
    }));
    
    res.json(publicUsers);
});

// GET SINGLE USER
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: "User not found!" });
    }
});

// LOGOUT (frontend handles this)
app.post('/logout', (req, res) => {
    res.json({ message: "Logged out successfully!" });
});

// ========== GENERATIVE QnA ENDPOINT ==========
// POST { question: string, context?: string }
app.post('/qna', async (req, res) => {
    try {
        const { question, context } = req.body || {};
        console.log('QnA request received. genaiClient status:', genaiClient ? 'initialized' : 'undefined');
        
        if (!question || !question.trim()) {
            return res.status(400).json({ error: 'Question is required' });
        }

        if (!genaiClient) {
            console.warn('genaiClient is not initialized');
            return res.status(503).json({ error: 'GenAI client not configured on server. Please set GENAI_API_KEY in .env' });
        }

        const modelName = process.env.GENAI_MODEL || 'gemini-2.5-flash';
        
        // Explicitly instruct the model on the expected JSON structure
        const jsonInstructions = `Respond strictly with a JSON array. Each object in the array must have the keys: "question" (string), "options" (an array of 4 strings), and "correct" (integer representing the 0-based index of the correct option).`;
        const prompt = context 
            ? `Context:\n${context}\n\nTask: ${question}\n\n${jsonInstructions}` 
            : `Task: ${question}\n\n${jsonInstructions}`;

        console.log('Calling GenAI with model:', modelName);

        // Call the Gemini API
        const response = await genaiClient.models.generateContent({
            model: modelName,
            contents: prompt,
            // Note: Depending on your exact SDK wrapper version, this might be nested under `config` instead of `generationConfig`
            config: {
                temperature: 0.2,
                maxOutputTokens: 2048, // Increased to ensure the full JSON array fits
                responseMimeType: "application/json" // CRITICAL: Forces pure JSON output without markdown
            }
        });

        // The SDK handles extracting the text, no need to dig into candidates array manually
        const answerText = response.text;
        
        let parsedAnswer;
        try {
            // Because of responseMimeType, we can confidently parse the text directly
            parsedAnswer = JSON.parse(answerText);
        } catch (parseError) {
            console.error('Failed to parse GenAI response as JSON:', answerText);
            return res.status(500).json({ error: 'Model did not return valid JSON' });
        }

        res.json({ answer: parsedAnswer });
    } catch (error) {
        console.error('QnA error:', error);
        res.status(500).json({ error: 'Failed to generate answer', detail: error.message });
    }
});

const PORT = process.env.PORT || 5000;

// Start server function
async function startServer() {
    // Initialize GenAI before starting the server
    await initializeGenAI();
    
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
        console.log(`📝 Test it: http://localhost:${PORT}/test`);
    });
}

// Start the server
startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});