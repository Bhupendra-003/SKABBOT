const mysql = require('mysql2');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'botuser',
    port: 3306,
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});
const updateXP = async (email, xpToAdd) => {
    const [result] = await connection.promise().query(
        'UPDATE users SET xp = xp + ? WHERE email = ?',
        [xpToAdd, email]
    );
    return result;
};

const getXP = async (email) => {
    const [rows] = await connection.promise().query(
        'SELECT xp FROM users WHERE email = ?',
        [email]
    );
    return rows[0]?.xp || 0;
};
    
const updateStreak = async (email) => {
    const [user] = await connection.promise().query(
        'SELECT streak, last_game_played FROM users WHERE email = ?',
        [email]
    );

    const lastActivity = user[0]?.last_game_played;
    const today = new Date().toISOString().split('T')[0];
    
    if (lastActivity === today) return user[0].streak;

    let streak;
    if (!lastActivity) {
        streak = 1;
    } else {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const lastActivityDate = new Date(lastActivity).toISOString().split('T')[0];
        
        if (lastActivityDate === yesterday) {
            streak = user[0].streak + 1;
        } else {
            streak = 1;
        }
    }
    await connection.promise().query(
        'UPDATE users SET streak = ?, last_game_played = ? WHERE email = ?',
        [streak, today, email]
    );

    return streak;
};
const getStreak = async (email) => {
    const [rows] = await connection.promise().query(
        'SELECT streak FROM users WHERE email = ?',
        [email]
    );
    return rows[0]?.streak || 0;
};
module.exports = { connection, updateXP, getXP, getStreak, updateStreak };