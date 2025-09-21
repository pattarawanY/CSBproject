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
            const [rows] = await db.query(`
                SELECT 
                p2.*,
                p2.yearPass2,
                pj.p_ID as p_ID, 
                pj.p_nameEN, 
                pj.p_nameTH, 
                pj.s_name1, 
                pj.s_name2, 
                pj.s_code1, 
                pj.s_code2
            FROM project2 p2
            LEFT JOIN project1 p1 ON p2.pj1_ID = p1.pj1_ID
            LEFT JOIN project pj ON p1.p_ID = pj.p_ID
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
            yearPj2,
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
                (pj1_ID, yearPj2, gradePj2, engS1, engS2, test30, docStatus2, gradeSend1, gradeSend2, createdDate, modifiedDate, note)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
                [pj1_ID, yearPj2, gradePj2, engS1, engS2, test30, docStatus2, gradeSend1, gradeSend2, note]
            );
            res.status(201).json({ pj2_ID: result.insertId, ...req.body });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async update(req, res) {
        const { pj2_ID } = req.params;
        const {
            yearPj2, gradePj2, engS1, engS2, test30, docStatus2, passStatus2,
            gradeSend1, gradeSend2, note, yearPass2, modifiedDate
        } = req.body;

        try {
            await db.query(
                `UPDATE project2 
             SET yearPj2=?, gradePj2=?, engS1=?, engS2=?, test30=?, docStatus2=?, passStatus2=?, gradeSend1=?, gradeSend2=?, note=?, yearPass2=?, modifiedDate=? 
             WHERE pj2_ID=?`,
                [yearPj2, gradePj2, engS1, engS2, test30, docStatus2, passStatus2, gradeSend1, gradeSend2, note, yearPass2, modifiedDate, pj2_ID]
            );
            res.json({ success: true });
        } catch (error) {
            console.error("Update Error:", error); // เพิ่ม log
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getByPj1Id(req, res) {
        const { pj1_ID } = req.params;
        try {
            const [rows] = await db.query('SELECT * FROM project2 WHERE pj1_ID = ?', [pj1_ID]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getYearPass2(req, res) {
        try {
            const [rows] = await db.query(`
            SELECT pj1_ID, yearPass2 FROM project2
        `);
            res.json(rows);
        } catch (error) {
            console.error('DB Error:', error); // ✅ เพิ่มบรรทัดนี้
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = Project2Controller;