const db = require('../db');

const Project2Controller = {
    async getByProjectId(req, res) {
        const { p_ID } = req.params;
        try {
            const [rows] = await db.query('SELECT * FROM project2 WHERE p_ID = ?', [p_ID]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async create(req, res) {

    },

    async update(req, res) {
        
    }
}

module.exports = Project2Controller;