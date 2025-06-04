const db = require('../db');

const ProjectController = {
    async getAllProject(req, res) {
        try {
            const [rows] = await db.query('SELECT * FROM project');
            res.json(rows);
        } catch (error) {
            console.error('Error fetching projects:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getProjectById(req, res) {
        const { id } = req.params;
        try {
            const [rows] = await db.query('SELECT * FROM project WHERE p_ID = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error('Error fetching project:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async createProject(req, res) {
        const {
            p_nameEN,
            p_nameTH,
            s_name1,
            s_name2,
            s_code1,
            s_code2,
            mainMentor,
            coMentor,
            semester,
            createdDate,
            modifiedDate,
            yearPj1
        } = req.body;
        const db = require('../db');
        try {
            // 1. Insert ลง project (ไม่ต้องใส่ p_ID)
            const [result] = await db.query(
                `INSERT INTO project 
                (p_nameEN, p_nameTH, s_name1, s_name2, s_code1, s_code2, mainMentor, coMentor, semester, createdDate, modifiedDate)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [p_nameEN, p_nameTH, s_name1, s_name2, s_code1, s_code2, mainMentor, coMentor, semester, createdDate, modifiedDate]
            );
            const newProjectId = result.insertId; // <-- ได้ p_ID ที่เพิ่ง insert

            // 2. Insert ลง project1 โดยใช้ p_ID ที่ได้มา
            await db.query(
                `INSERT INTO project1 (p_ID, yearPj1, createdDate, modifiedDate) VALUES (?, ?, ?, ?)`,
                [newProjectId, yearPj1, createdDate, modifiedDate]
            );
            res.status(201).json({ message: 'Project and Project1 created successfully' });
        } catch (error) {
            console.error('Error creating project:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async updateProject(req, res) {
        const { id } = req.params;
        const {
            p_nameEN,
            p_nameTH,
            s_name1,
            s_name2,
            s_code1,
            s_code2,
            mainMentor,
            coMentor,
            modifiedDate
        } = req.body;

        // สร้าง array สำหรับเก็บ field ที่จะอัปเดต
        const fields = [];
        const values = [];

        if (p_nameEN !== undefined) { fields.push('p_nameEN = ?'); values.push(p_nameEN); }
        if (p_nameTH !== undefined) { fields.push('p_nameTH = ?'); values.push(p_nameTH); }
        if (s_name1 !== undefined) { fields.push('s_name1 = ?'); values.push(s_name1); }
        if (s_name2 !== undefined) { fields.push('s_name2 = ?'); values.push(s_name2); }
        if (s_code1 !== undefined) { fields.push('s_code1 = ?'); values.push(s_code1); }
        if (s_code2 !== undefined) { fields.push('s_code2 = ?'); values.push(s_code2); }
        if (mainMentor !== undefined) { fields.push('mainMentor = ?'); values.push(mainMentor); }
        if (coMentor !== undefined) { fields.push('coMentor = ?'); values.push(coMentor); }
        if (modifiedDate !== undefined) { fields.push('modifiedDate = ?'); values.push(modifiedDate); }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);

        try {
            const [result] = await db.query(
                `UPDATE project SET ${fields.join(', ')} WHERE p_ID = ?`,
                values
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.json({ message: 'Project updated successfully' });
        } catch (error) {
            console.error('Error updating project:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deleteProject(req, res) {
        const { id } = req.params;
        try {
            const [result] = await db.query('DELETE FROM project WHERE p_ID = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.json({ message: 'Project deleted successfully' });
        } catch (error) {
            console.error('Error deleting project:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
}

module.exports = ProjectController;