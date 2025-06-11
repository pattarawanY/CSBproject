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

    async getAll(req, res) {
        try {
            // Join กับตาราง project (หรือ project1) เพื่อดึงรายละเอียดโปรเจค
            const [rows] = await db.query(`
                SELECT 
                    p2.*, 
                    pj.p_nameEN, 
                    pj.p_nameTH, 
                    pj.s_name1, 
                    pj.s_name2, 
                    pj.s_code1, 
                    pj.s_code2
                FROM project2 p2
                LEFT JOIN project pj ON p2.pj1_ID = pj.p_ID
            `);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async create(req, res) {
        // รับข้อมูลจาก req.body
        const {
            pj1_ID,
            yaerPj2,
            gradePj2,
            engS1,
            engS2,
            test30,
            docStatus2,
            gradeSend1,
            gradeSend2,
            note
        } = req.body;

        try {
            // เพิ่มข้อมูลลงใน project2
            const [result] = await db.query(
                `INSERT INTO project2 
                (pj1_ID, yaerPj2, gradePj2, engS1, engS2, test30, docStatus2, gradeSend1, gradeSend2, createdDate, modifiedDate, note)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
                [pj1_ID, yaerPj2, gradePj2, engS1, engS2, test30, docStatus2, gradeSend1, gradeSend2, note]
            );
            res.status(201).json({ pj2_ID: result.insertId, ...req.body });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async update(req, res) {

    },

}

module.exports = Project2Controller;