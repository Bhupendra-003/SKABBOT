const mysql = require('mysql2');

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'botuser',
    port: 3306,
    timezone: 'Z'
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
    const [rows] = await connection.promise().query(
        'SELECT streak, last_game_played FROM users WHERE email = ?',
        [email]
    );
    console.log(rows)
    const user = rows[0];

    const lastActivity = user?.last_game_played
        ? new Date(user.last_game_played).toISOString().split('T')[0] // Convert to UTC date
        : null;
    const today = new Date().toISOString().split('T')[0]; // Get today's date in UTC

    console.log('Last activity:', lastActivity);
    console.log('Today:', today);

    if (lastActivity === today) {
        return user.streak; // User already played today
    }

    let streak;
    if (!lastActivity) {
        streak = 1;
    } else {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        console.log('Yesterday:', yesterday);
        console.log('Last activity:', lastActivity);
        if (lastActivity === yesterday) {
            streak = user.streak + 1;
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