import React, { useState, useEffect } from 'react';
import './App.css';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
    // ========== STATE VARIABLES ==========
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [view, setView] = useState('home');
    
    // Form data
    const [formData, setFormData] = useState({
        name: '',
        skillsToTeach: '',
        skillsToLearn: '',
        githubUsername: '',
        linkedinUrl: ''
    });
    
    // Skills for AI test
    const [skillsForTest, setSkillsForTest] = useState('');
    
    // AI Test state
    const [testSessionId, setTestSessionId] = useState(null);
    const [testQuestions, setTestQuestions] = useState([]);
    const [testAnswers, setTestAnswers] = useState({});
    const [testResult, setTestResult] = useState(null);
    
    // Project upload
    const [projectFiles, setProjectFiles] = useState([]);
    
    // Swap requests
    const [selectedUser, setSelectedUser] = useState(null);
    const [swapSkillOffered, setSwapSkillOffered] = useState('');
    const [swapSkillRequested, setSwapSkillRequested] = useState('');
    
    // Chat state
    const [activeChat, setActiveChat] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    
    // Rating state
    const [ratingSession, setRatingSession] = useState(null);
    const [ratingValue, setRatingValue] = useState(5);
    const [ratingReview, setRatingReview] = useState('');
    // QnA state
    const [qnaQuestion, setQnaQuestion] = useState('');
    const [qnaContext, setQnaContext] = useState('');
    const [qnaAnswer, setQnaAnswer] = useState(null);
    const [qnaLoading, setQnaLoading] = useState(false);

    // ========== LOAD DATA ON START ==========
    useEffect(() => {
        fetchUsers();
        
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    // ========== API FUNCTIONS ==========
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            const data = await response.json();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users. Is backend running?');
        }
        setLoading(false);
    };

    // Fetch current user's latest data (including pending requests and active sessions)
    const fetchCurrentUserData = async () => {
        if (!currentUser) return;
        try {
            const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`);
            if (response.ok) {
                const updatedUser = await response.json();
                setCurrentUser(updatedUser);
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            }
        } catch (err) {
            console.error('Failed to fetch current user data');
        }
    };

    // Refresh user data when viewing profile
    useEffect(() => {
        if (view === 'profile' && currentUser) {
            fetchCurrentUserData();
        }
    }, [view, currentUser?.id]);

    // Generate AI test questions via `/qna` (asks the generative endpoint to return JSON)
const generateTest = async () => {
    if (!skillsForTest.trim()) {
        alert('Please enter your skills first!');
        return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    
    try {
        const prompt = `Generate up to 10 multiple-choice questions (4 options each) based on these skills: ${skillsForTest}.`;

        const response = await fetch(`${API_BASE_URL}/qna`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: prompt })
        });

        const data = await response.json();

        // Check if data.answer exists and is an array (since backend parsed it already)
        if (response.ok && Array.isArray(data.answer)) {
            
            // Normalize and map to your state structure
            const questions = data.answer.slice(0, 10).map((q, idx) => ({
                id: idx + 1,
                question: q.question || `Question ${idx + 1}`,
                options: Array.isArray(q.options) ? q.options : [],
                correct: typeof q.correct === 'number' ? q.correct : 0
            }));

            if (questions.length === 0) {
                setError('AI returned no valid questions');
            } else {
                setTestSessionId(Date.now().toString());
                setTestQuestions(questions);
                setTestAnswers({});
                setTestResult(null);
                setView('test');
            }
        } else {
            setError(data.error || 'Failed to generate test. Please try again.');
        }
    } catch (err) {
        console.error('Frontend error:', err);
        setError('Network error or server failed to respond.');
    } finally {
        setLoading(false);
    }
};

    // Handle test answers
    const handleTestAnswer = (questionIndex, optionIndex) => {
        setTestAnswers({
            ...testAnswers,
            [questionIndex]: optionIndex
        });
    };

    // Submit test
    const submitTest = async () => {
        if (Object.keys(testAnswers).length < testQuestions.length) {
            alert(`Please answer all ${testQuestions.length} questions!`);
            return;
        }
        
        setLoading(true);
        try {
            const answers = [];
            for (let i = 0; i < testQuestions.length; i++) {
                answers.push(testAnswers[i]);
            }
            
            const response = await fetch(`${API_BASE_URL}/submit-test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers })
            });
            
            const result = await response.json();
            setTestResult(result);
            
            if (result.passed) {
                setFormData({
                    ...formData,
                    mcqScore: result.correctCount
                });
                setTimeout(() => {
                    setView('register');
                }, 2000);
            }
        } catch (err) {
            setError('Failed to submit test');
        }
        setLoading(false);
    };

    // Handle registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setCurrentUser(data);
                localStorage.setItem('currentUser', JSON.stringify(data));
                setFormData({
                    name: '',
                    skillsToTeach: '',
                    skillsToLearn: '',
                    githubUsername: '',
                    linkedinUrl: ''
                });
                setSkillsForTest('');
                setTestResult(null);
                fetchUsers();
                setView('profile');
                alert('✅ Registration successful!');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
        setLoading(false);
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        setProjectFiles([...e.target.files]);
    };

    // Upload projects
    const uploadProjects = async () => {
        if (!currentUser || projectFiles.length === 0) return;
        
        const formData = new FormData();
        formData.append('userId', currentUser.id);
        projectFiles.forEach(file => {
            formData.append('projects', file);
        });
        
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/upload-project`, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            if (response.ok) {
                alert('✅ Projects uploaded successfully!');
                fetchUsers();
                setProjectFiles([]);
            }
        } catch (err) {
            setError('Failed to upload projects');
        }
        setLoading(false);
    };

    // Request swap
    const requestSwap = async (toUserId) => {
        if (!swapSkillOffered || !swapSkillRequested) {
            alert('Please enter both skills');
            return;
        }
        
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/request-swap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fromUserId: currentUser.id,
                    toUserId,
                    skillOffered: swapSkillOffered,
                    skillRequested: swapSkillRequested
                })
            });
            
            if (response.ok) {
                alert('✅ Swap request sent!');
                setSelectedUser(null);
                setSwapSkillOffered('');
                setSwapSkillRequested('');
                fetchUsers();
            }
        } catch (err) {
            setError('Failed to send request');
        }
        setLoading(false);
    };

    // Accept swap
    const acceptSwap = async (requestId) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/accept-swap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId,
                    userId: currentUser.id
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                alert('✅ Request accepted! You can now chat.');
                // Use the returned user data
                if (data.user) {
                    setCurrentUser(data.user);
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                }
                fetchUsers();
            }
        } catch (err) {
            setError('Failed to accept request');
        }
        setLoading(false);
    };

    // Open chat
    const openChat = async (session) => {
        setActiveChat(session);
        setView('chat');
        
        try {
            const response = await fetch(`${API_BASE_URL}/chat-messages/${session.id}`);
            const data = await response.json();
            setChatMessages(data);
        } catch (err) {
            console.error('Failed to fetch messages');
        }
    };

    // Send message
    const sendMessage = async () => {
        if (!newMessage.trim() || !activeChat) return;
        
        const otherParticipant = activeChat.participants.find(id => id !== currentUser.id);
        
        try {
            const response = await fetch(`${API_BASE_URL}/send-message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: activeChat.id,
                    fromUserId: currentUser.id,
                    toUserId: otherParticipant,
                    message: newMessage
                })
            });
            
            const data = await response.json();
            if (response.ok) {
                setChatMessages([...chatMessages, data.chatMessage]);
                setNewMessage('');
            }
        } catch (err) {
            setError('Failed to send message');
        }
    };

    // Submit rating
    const submitRating = async () => {
        if (!ratingSession) return;
        
        const instructor = users.find(u => 
            u.id === ratingSession.participants.find(id => id !== currentUser.id)
        );
        
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/submit-rating`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fromUserId: currentUser.id,
                    toUserId: instructor.id,
                    sessionId: ratingSession.id,
                    rating: ratingValue,
                    review: ratingReview
                })
            });
            
            if (response.ok) {
                alert('✅ Rating submitted!');
                setRatingSession(null);
                setRatingValue(5);
                setRatingReview('');
                setView('home');
                fetchUsers();
            }
        } catch (err) {
            setError('Failed to submit rating');
        }
        setLoading(false);
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        setView('home');
        alert('👋 Logged out successfully!');
    };

    // ========== RENDER FUNCTIONS ==========
    
    // Home view
    const renderHome = () => (
        <div>
            <div className="hero-section">
                <h1>🤖 AI-Powered SkillSwap</h1>
                <p>Share your skills, learn from others, get verified by AI</p>
                {!currentUser && (
                    <button 
                        className="btn btn-primary btn-large"
                        onClick={() => setView('skills-input')}
                    >
                        Get Started with AI Test
                    </button>
                )}
            </div>

            <div className="users-section">
                <h2>Community Members ({users.length})</h2>
                
                {loading && <div className="spinner">Loading...</div>}
                
                <div className="users-grid">
                    {users.map(user => (
                        <div key={user.id} className="user-card">
                            <div className="card-header">
                                <h3>{user.name}</h3>
                                <span className="basemark">
                                    BaseMark: {user.baseMark}/10
                                </span>
                            </div>
                            
                            <div className="card-body">
                                <div className="skills">
                                    <strong>Can Teach:</strong>
                                    <div className="skill-tags">
                                        {user.skillsToTeach.map((skill, i) => (
                                            <span key={i} className="tag">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                                
                                {user.skillsToLearn.length > 0 && (
                                    <div className="skills">
                                        <strong>Wants to Learn:</strong>
                                        <div className="skill-tags">
                                            {user.skillsToLearn.map((skill, i) => (
                                                <span key={i} className="tag">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="score-badges">
                                    {user.githubUsername && (
                                        <span className="badge github">GitHub: {user.githubScore}/6</span>
                                    )}
                                    {user.linkedinUrl && (
                                        <span className="badge linkedin">LinkedIn ✓</span>
                                    )}
                                    {user.mcqScore > 0 && (
                                        <span className="badge mcq">AI Test: {user.mcqScore}/10</span>
                                    )}
                                </div>
                                
                                <div className="rating">
                                    ⭐ Rating: {user.averageRating ? user.averageRating.toFixed(1) : 'New'}/5
                                </div>
                                
                                <div className="credits">
                                    💰 Credits: {user.credits || 0}
                                </div>
                            </div>
                            
                            {currentUser && currentUser.id !== user.id && (
                                <div className="card-footer">
                                    {selectedUser === user.id ? (
                                        <div className="swap-form">
                                            <input
                                                type="text"
                                                placeholder="Skill you'll teach"
                                                value={swapSkillOffered}
                                                onChange={(e) => setSwapSkillOffered(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Skill you want"
                                                value={swapSkillRequested}
                                                onChange={(e) => setSwapSkillRequested(e.target.value)}
                                            />
                                            <button 
                                                className="btn btn-success"
                                                onClick={() => requestSwap(user.id)}
                                            >
                                                Send Request
                                            </button>
                                            <button 
                                                className="btn btn-secondary"
                                                onClick={() => setSelectedUser(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            className="btn btn-primary"
                                            onClick={() => setSelectedUser(user.id)}
                                        >
                                            Request Swap
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Skills input view
    const renderSkillsInput = () => (
        <div className="form-container">
            <h2>🤖 AI Skill Assessment</h2>
            <p>The AI will generate 10 questions based on your skills</p>
            <p className="highlight">You need to answer at least 6 correctly to register</p>
            
            <div className="form-group">
                <label>Enter your skills (comma-separated)</label>
                <input
                    type="text"
                    value={skillsForTest}
                    onChange={(e) => setSkillsForTest(e.target.value)}
                    placeholder="JavaScript, Python, React, AI, Machine Learning"
                />
                <small>Example: JavaScript, Python, React, Node.js</small>
            </div>
            
            <div className="form-actions">
                <button 
                    className="btn btn-primary"
                    onClick={generateTest}
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate AI Test'}
                </button>
                <button 
                    className="btn btn-secondary"
                    onClick={() => setView('home')}
                >
                    Cancel
                </button>
            </div>
        </div>
    );

    // Test view
    const renderTest = () => (
        <div className="form-container">
            <h2>📝 AI-Generated Test</h2>
            <p>Answer at least 6 questions correctly to register</p>
            <div className="question-count">Questions: {testQuestions.length}</div>
            
            {testQuestions.map((q, index) => (
                <div key={index} className="test-question">
                    <p><strong>{index + 1}. {q.question}</strong></p>
                    <div className="test-options">
                        {q.options.map((option, optIndex) => (
                            <label key={optIndex} className="test-option">
                                <input
                                    type="radio"
                                    name={`q${index}`}
                                    value={optIndex}
                                    checked={testAnswers[index] === optIndex}
                                    onChange={() => handleTestAnswer(index, optIndex)}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            
            <div className="form-actions">
                <button 
                    className="btn btn-primary"
                    onClick={submitTest}
                    disabled={loading}
                >
                    {loading ? 'Checking...' : 'Submit Answers'}
                </button>
                <button 
                    className="btn btn-secondary"
                    onClick={() => setView('skills-input')}
                >
                    Back
                </button>
            </div>
            
            {testResult && (
                <div className={`test-result ${testResult.passed ? 'success' : 'error'}`}>
                    <h3>{testResult.message}</h3>
                    <p>You got {testResult.correctCount} out of {testResult.totalQuestions} correct</p>
                </div>
            )}
        </div>
    );

    // Registration view
    const renderRegister = () => (
        <div className="form-container">
            <h2>📝 Complete Registration</h2>
            {testResult && testResult.passed && (
                <div className="success-message">
                    ✅ You passed the AI test! Score: {testResult.correctCount}/10
                </div>
            )}
            
            <form onSubmit={handleRegister}>
                <div className="form-group">
                    <label>Your Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="John Doe"
                    />
                </div>

                <div className="form-group">
                    <label>Skills You Can Teach * (comma-separated)</label>
                    <input
                        type="text"
                        name="skillsToTeach"
                        value={formData.skillsToTeach}
                        onChange={handleInputChange}
                        required
                        placeholder="JavaScript, Python, React"
                    />
                </div>

                <div className="form-group">
                    <label>Skills You Want to Learn</label>
                    <input
                        type="text"
                        name="skillsToLearn"
                        value={formData.skillsToLearn}
                        onChange={handleInputChange}
                        placeholder="Node.js, MongoDB, AWS"
                    />
                </div>

                <div className="form-group">
                    <label>GitHub Username (optional)</label>
                    <input
                        type="text"
                        name="githubUsername"
                        value={formData.githubUsername}
                        onChange={handleInputChange}
                        placeholder="johndoe"
                    />
                </div>

                <div className="form-group">
                    <label>LinkedIn Profile URL (optional)</label>
                    <input
                        type="url"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/johndoe"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        Complete Registration
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setView('home')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );

    // Profile view
    const renderProfile = () => (
        <div className="profile-container">
            <h2>👤 My Profile</h2>
            
            <div className="profile-stats">
                <div className="stat-card">
                    <h3>BaseMark</h3>
                    <p className="stat-value">{currentUser.baseMark}/10</p>
                </div>
                <div className="stat-card">
                    <h3>Credits</h3>
                    <p className="stat-value">{currentUser.credits || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Projects</h3>
                    <p className="stat-value">{currentUser.projects?.length || 0}</p>
                </div>
            </div>
            
            <div className="profile-section">
                <h3>📊 My Details</h3>
                <div className="profile-details">
                    <p><strong>Name:</strong> {currentUser.name}</p>
                    <p><strong>Skills to Teach:</strong> {currentUser.skillsToTeach.join(', ')}</p>
                    <p><strong>Skills to Learn:</strong> {currentUser.skillsToLearn.join(', ')}</p>
                    {currentUser.githubUsername && (
                        <p><strong>GitHub:</strong> {currentUser.githubUsername}</p>
                    )}
                    {currentUser.linkedinUrl && (
                        <p><strong>LinkedIn:</strong> <a href={currentUser.linkedinUrl} target="_blank" rel="noopener noreferrer">View Profile</a></p>
                    )}
                </div>
            </div>
            
            <div className="profile-section">
                <h3>📊 Score Breakdown</h3>
                <div className="score-breakdown">
                    <div>Base Score: 5.0</div>
                    <div>GitHub: +{currentUser.githubScore || 0}</div>
                    <div>LinkedIn: +{currentUser.linkedinScore || 0}</div>
                    <div>AI Test: +{currentUser.mcqScore || 0}</div>
                    <div className="total">Total: {currentUser.baseMark}/10</div>
                </div>
            </div>
            
            <div className="profile-section">
                <h3>📁 Upload Projects</h3>
                <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="file-input"
                />
                <button 
                    className="btn btn-primary"
                    onClick={uploadProjects}
                    disabled={projectFiles.length === 0 || loading}
                >
                    Upload Projects
                </button>
                {projectFiles.length > 0 && (
                    <p>{projectFiles.length} file(s) selected</p>
                )}
            </div>
            
            <div className="profile-section">
                <h3>⏳ Pending Requests</h3>
                {currentUser.pendingRequests?.length > 0 ? (
                    currentUser.pendingRequests.map(req => (
                        <div key={req.id} className="request-card">
                            <p><strong>From:</strong> {req.fromUser.name}</p>
                            <p><strong>Offers:</strong> {req.skillOffered}</p>
                            <p><strong>Wants:</strong> {req.skillRequested}</p>
                            <button 
                                className="btn btn-success"
                                onClick={() => acceptSwap(req.id)}
                            >
                                Accept Request
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No pending requests</p>
                )}
            </div>
            
            <div className="profile-section">
                <h3>💬 Active Sessions</h3>
                {currentUser.acceptedSessions?.length > 0 ? (
                    currentUser.acceptedSessions.map(session => {
                        const otherUser = users.find(u => 
                            session.participants.includes(u.id) && u.id !== currentUser.id
                        );
                        return (
                            <div key={session.id} className="session-card">
                                <p><strong>With:</strong> {otherUser?.name}</p>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => openChat(session)}
                                >
                                    Open Chat
                                </button>
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setRatingSession(session);
                                        setView('rating');
                                    }}
                                >
                                    Rate Session
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <p>No active sessions</p>
                )}
            </div>
        </div>
    );

    // Chat view
    const renderChat = () => {
        const otherUser = users.find(u => 
            activeChat?.participants.includes(u.id) && u.id !== currentUser.id
        );
        
        return (
            <div className="chat-container">
                <div className="chat-header">
                    <h2>💬 Chat with {otherUser?.name}</h2>
                    <button 
                        className="btn btn-secondary"
                        onClick={() => setView('profile')}
                    >
                        Back to Profile
                    </button>
                </div>
                
                <div className="chat-messages">
                    {chatMessages.map(msg => (
                        <div 
                            key={msg.id} 
                            className={`message ${msg.fromUserId === currentUser.id ? 'sent' : 'received'}`}
                        >
                            <p>{msg.message}</p>
                            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                        </div>
                    ))}
                </div>
                
                <div className="chat-input">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button 
                        className="btn btn-primary"
                        onClick={sendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        );
    };

    // Rating view
    const renderRating = () => {
        const instructor = users.find(u => 
            ratingSession?.participants.includes(u.id) && u.id !== currentUser.id
        );
        
        return (
            <div className="rating-container">
                <h2>⭐ Rate Your Session</h2>
                <p>How was your session with {instructor?.name}?</p>
                
                <div className="stars">
                    {[1, 2, 3, 4, 5].map(star => (
                        <span
                            key={star}
                            className={`star ${star <= ratingValue ? 'selected' : ''}`}
                            onClick={() => setRatingValue(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>
                
                <textarea
                    placeholder="Write your review (optional)"
                    value={ratingReview}
                    onChange={(e) => setRatingReview(e.target.value)}
                    rows="4"
                />
                
                <div className="form-actions">
                    <button 
                        className="btn btn-primary"
                        onClick={submitRating}
                    >
                        Submit Rating
                    </button>
                    <button 
                        className="btn btn-secondary"
                        onClick={() => setView('profile')}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };

    // QnA view + function
    const askQnA = async () => {
        if (!qnaQuestion.trim()) return alert('Please enter a question');
        setQnaLoading(true);
        setQnaAnswer(null);
        try {
            const response = await fetch('http://localhost:5000/qna', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: qnaQuestion, context: qnaContext })
            });

            const data = await response.json();
            if (response.ok) {
                setQnaAnswer(data.answer || 'No answer returned');
            } else {
                setQnaAnswer(`Error: ${data.error || data.detail || 'Unknown'}`);
            }
        } catch (err) {
            setQnaAnswer('Failed to contact server');
        }
        setQnaLoading(false);
    };

    const renderQnA = () => (
        <div className="form-container">
            <h2>🤖 Ask the AI (Gemini)</h2>
            <p>Ask a question about skills, projects, or anything helpful for the community.</p>

            <div className="form-group">
                <label>Your Question</label>
                <textarea
                    rows="3"
                    value={qnaQuestion}
                    onChange={(e) => setQnaQuestion(e.target.value)}
                    placeholder="e.g. How do I get started with React hooks?"
                />
            </div>

            <div className="form-group">
                <label>Optional Context (short)</label>
                <input
                    type="text"
                    value={qnaContext}
                    onChange={(e) => setQnaContext(e.target.value)}
                    placeholder="Provide context like 'beginner', 'frontend', etc." 
                />
            </div>

            <div className="form-actions">
                <button className="btn btn-primary" onClick={askQnA} disabled={qnaLoading}>
                    {qnaLoading ? 'Asking...' : 'Ask AI'}
                </button>
                <button className="btn btn-secondary" onClick={() => setView('home')}>Back</button>
            </div>

            {qnaAnswer && (
                <div className="qna-answer">
                    <h3>Answer</h3>
                    <div className="answer-box">{qnaAnswer}</div>
                </div>
            )}
        </div>
    );

    // ========== MAIN RENDER ==========
    return (
        <div className="App">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="nav-brand">🤖 AI SkillSwap</div>
                <div className="nav-user">
                    {currentUser ? (
                        <div className="user-info">
                            <span>Hello, {currentUser.name}!</span>
                            <span className="badge">BaseMark: {currentUser.baseMark}</span>
                            <button 
                                className="btn btn-outline"
                                onClick={() => setView('profile')}
                            >
                                Profile
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => setView('qna')}
                            >
                                Ask AI
                            </button>
                            <button 
                                className="btn btn-secondary"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button 
                            className="btn btn-primary"
                            onClick={() => setView('skills-input')}
                        >
                            Register with AI
                        </button>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <div className="container">
                {error && (
                    <div className="error">
                        ❌ {error}
                        <button onClick={() => setError(null)}>×</button>
                    </div>
                )}

                {view === 'home' && renderHome()}
                {view === 'skills-input' && renderSkillsInput()}
                {view === 'test' && renderTest()}
                {view === 'register' && renderRegister()}
                {view === 'profile' && currentUser && renderProfile()}
                {view === 'chat' && currentUser && renderChat()}
                {view === 'rating' && currentUser && renderRating()}
                {view === 'qna' && renderQnA()}
            </div>
        </div>
    );
}

export default App;