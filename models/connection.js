const fs = require('fs');
const Hash = require('password-hash');

// Initialize users.json if it doesn't exist
if (!fs.existsSync('users.json')) {
    fs.writeFileSync('users.json', JSON.stringify([], null, 4), 'utf-8');
}

function getUsers() {
    try {
        return JSON.parse(fs.readFileSync('users.json', 'utf-8'));
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
}

function saveUsers(users) {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 4), 'utf-8');
}

function addUser(name, email, password) {
    const users = getUsers();
    const hashedPassword = Hash.generate(password);
    const newUser = {
        name,
        email,
        password: hashedPassword,
        xp: 0,
        streak: 0,
        lastPlayed: "",
        lastLogin: new Date().toISOString()
    };
    if(users.push(newUser)){
        console.log('New User added!')
    }
    
    saveUsers(users);
    return newUser;
}

function findUserByEmail(email) {
    const users = getUsers();
    return users.find(user => user.email === email);
}

function validateUser(email, password) {
    const users = getUsers();
    const user = users.find(user => user.email === email);
    return user && Hash.verify(password, user.password) ? user : null;
}

async function updateXP(email, xpToAdd) {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    if (user) {
        user.xp = (user.xp || 0) + xpToAdd;
        saveUsers(users);
        return user.xp;
    }
    return 0;
}

async function getXP(email) {
    const user = findUserByEmail(email);
    return user ? user.xp : 0;
}

async function getStreak(email) {
    const user = findUserByEmail(email);
    return user ? user.streak : 0;
}

async function updateStreak(email) {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    if (user) {
        const today = new Date();
        const lastPlayed = new Date(user.lastPlayed);
        const timeDiff = today.getTime() - lastPlayed.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

        if (daysDiff === 1) {
            // Last played yesterday, increment streak
            user.streak = (user.streak || 0) + 1;
            user.lastPlayed = today.toISOString();
        } else if (daysDiff === 0) {
            // Played today, keep current streak
            return user.streak;
        } else {
            // Not played for more than a day, reset streak
            user.streak = 1;
            user.lastPlayed = today.toISOString();
        }
        saveUsers(users);
        return user.streak;
    }
    return 0;
}
const db = {
    addUser,
    findUserByEmail,
    validateUser,
    updateXP,
    getXP,
    getStreak,
    updateStreak
}
module.exports = db;
