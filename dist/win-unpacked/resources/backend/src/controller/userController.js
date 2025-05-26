const db = require('../db');

const UserController = {
    async getAllUsers(req, res) {
        try {
            const [rows] = await db.query('SELECT * FROM user');
            res.json(rows);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = UserController;