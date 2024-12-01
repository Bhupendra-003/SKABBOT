const mongoose = require('mongoose');
const Hash = require('password-hash');
dotenv = require('dotenv');
dotenv.config();

// MongoDB User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastPlayed: { type: String, default: "" },
    lastLogin: { type: String, default: () => new Date().toISOString() }
});

const User = mongoose.model('User', userSchema);

// Connect to MongoDB Atlas
(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
    }
})();

async function addUser(name, email, password) {
    const hashedPassword = Hash.generate(password);
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });
    await newUser.save();
    return newUser;
}

async function getUserDetails(email) {
    const user = await User.findOne({ email });
    const details = {
        name: user?.name,
        email: user?.email,
        xp: user?.xp,
        streak: user?.streak,
        lastPlayed: user?.lastPlayed,
        lastLogin: user?.lastLogin
    };
    return details;
}
async function findUserByEmail(email) {
    const user = await User.findOne({ email });
    // console.log('User details:', {
    //     name: user?.name,
    //     email: user?.email
    // });
    return user;
}

async function validateUser(email, password) {
    const user = await User.findOne({ email });
    return user && Hash.verify(password, user.password) ? user : null;
}

async function updateXP(email, xpToAdd) {
    const user = await User.findOne({ email });
    if (user) {
        user.xp = (user.xp || 0) + xpToAdd;
        await user.save();
        return user.xp;
    }
    return 0;
}

async function getXP(email) {
    const user = await User.findOne({ email });
    return user ? user.xp : 0;
}

async function getStreak(email) {
    const user = await User.findOne({ email });
    return user ? user.streak : 0;
}

async function updateStreak(email) {
    const user = await User.findOne({ email });
    if (user) {
        const today = new Date();
        const lastPlayed = new Date(user.lastPlayed);
        const timeDiff = today.getTime() - lastPlayed.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

        if (daysDiff === 1) {
            user.streak = (user.streak || 0) + 1;
            user.lastPlayed = today.toISOString();
        } else if (daysDiff === 0) {
            return user.streak;
        } else {
            user.streak = 1;
            user.lastPlayed = today.toISOString();
        }
        await user.save();
        return user.streak;
    }
    return 0;
}

const db = {
    getUserDetails,
    addUser,
    findUserByEmail,
    validateUser,
    updateXP,
    getXP,
    getStreak,
    updateStreak
};
module.exports = db