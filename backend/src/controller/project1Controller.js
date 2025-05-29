const db = require('../db');

const Project1Controller = {
    // GET /project1/:p_ID
    async getByProjectId(req, res) {
        const { p_ID } = req.params;
        try {
            const [rows] = await db.query('SELECT * FROM project1 WHERE p_ID = ?', [p_ID]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getPj1PendingStatus(req, res) {
        // โปรเจคที่ยังไม่มีสถานะสักอย่าง(รอกรอก)
    },

    async getPj1PassStatus(req, res) {
        // โปรเจคที่สอบผ่านแล้ว เอกสารครบ มีเกรด ไปโปรเจค2
    },

    async getPj1FailStatus(req, res) {
        // โปรเจคที่เอกสารครบ เกรดออกแล้วเป็นF,Fe,IP
    },

    async getPj1DoccompleteStatus(req, res) {
        // โปรเจคที่เอกสารครบ แต่ยังไม่มีเกรด
    },
    
    async create(req, res) {
        const { p_ID, mentorStatus, docStatus, gradePj1, yearPj1, createdDate, modifiedDate } = req.body;
        try {
            const [result] = await db.query(
                'INSERT INTO project1 (p_ID, mentorStatus, docStatus, gradePj1, yearPj1, createdDate, modifiedDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [p_ID, mentorStatus, docStatus, gradePj1, yearPj1, createdDate, modifiedDate]
            );
            res.json({ pj1_ID: result.insertId, ...req.body });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async update(req, res) {
        const { pj1_ID } = req.params;
        const { mentorStatus, docStatus, gradePj1, yearPj1, modifiedDate } = req.body;
        try {
            await db.query(
                'UPDATE project1 SET mentorStatus=?, docStatus=?, gradePj1=?, yearPj1=?, modifiedDate=? WHERE pj1_ID=?',
                [mentorStatus, docStatus, gradePj1, yearPj1, modifiedDate, pj1_ID]
            );
            res.json({ message: 'Updated' });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = Project1Controller;