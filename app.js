// Import required modules
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const log = console .log;
const {getResponse} = require('./intentClass.js');
const db = require('./models/connection.js');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));

// Set up Express middleware and configurations
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{
    res.render('index');
});
app.get('/register', (req, res)=>{
    res.render('register');
});

app.post('/create', async (req, res) => {
    console.log(req.body);
    const { name, email, password } = req.body;
    if (db.findUserByEmail(email)) {
        return res.status(409).json({ message: 'Email already exists' });
    }

    try {
        db.addUser(name, email, password);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }    
});

app.get('/login', (req, res)=>{
    res.render('login');
});
app.post('/validate', async (req, res)=>{
    const {email, password} = req.body;
    const user = db.validateUser(email, password);
    
    if (user) {
        req.session.user = user;
        res.status(200).json({message: 'Login successful'});
    } else {
        res.status(401).json({message: 'Invalid credentials'});
    }    
});

app.get('/chat', async (req, res)=>{
    if (!req.session.user) {
        return res.redirect('/login');
    }
    const xp = await db.getXP(req.session.user.email);
    const streak = await db.getStreak(req.session.user.email);
    res.render('chat', {
        name: req.session.user.name,
        xp: xp,
        streak: streak
    });
});

app.post('/update-streak', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({message: "Not authenticated"});
    }
    
    try {
        const streak = await db.updateStreak(req.session.user.email);
        res.status(200).json({ streak });
    } catch (error) {
        res.status(500).json({message: "Error updating streak", error: error.message});
    }
});
app.post('/chat/process', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({message: "Not authenticated"});
    }
    
    const userInput = req.body.prompt;
    try {
        const xpEarned = 10; // XP per message
        await db.updateXP(req.session.user.email, xpEarned);
        const currentXP = await db.getXP(req.session.user.email);
        const streak = await db.getStreak(req.session.user.email);
        
        const response = await getResponse(userInput, streak, currentXP, );
        res.status(200).json({
            response: response.response,
            xp: currentXP
        });
    } catch (error) {
        res.status(500).json({message: "Error processing chat request", error: error.message});
    }
});
app.listen(3000, ()=>{
    log('Server is running on port 3000');
});

module.exports = app; 