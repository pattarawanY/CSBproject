const db = require('../db');

const StudentController = {
    async getAllStudents(req, res) {
        try {
            const [rows] = await db.query('SELECT * FROM project');
            res.json(rows);
        } catch (error) {
            console.error('Error fetching students:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getStudentByNameOrCode(req, res) {
        try {
            const { name } = req.query;
            if (!name) {
                return res.status(400).json({ error: 'Name or code query is required' });
            }
            const [rows] = await db.query(
                `SELECT * FROM project 
                 WHERE s_name1 LIKE ? OR s_name2 LIKE ?
                 OR s_code1 LIKE ? OR s_code2 LIKE ?
                 OR p_nameTH LIKE ? OR p_nameEN LIKE ?`,
                [
                    `%${name}%`, `%${name}%`,
                    `%${name}%`, `%${name}%`,
                    `%${name}%`, `%${name}%`
                ]
            );
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = StudentController;