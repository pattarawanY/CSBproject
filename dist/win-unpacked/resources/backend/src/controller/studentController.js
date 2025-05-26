const db = require('../db');

const StudentController = {
    async getAllStudents(req, res) {
        try {
            const [rows] = await db.query('SELECT * FROM student');
            res.json(rows);
        } catch (error) {
            console.error('Error fetching students:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = StudentController;