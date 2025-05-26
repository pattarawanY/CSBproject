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
            p_ID,
            p_nameEN,
            p_nameTH,
            s_name1,
            s_name2,
            s_code1,
            s_code2,
            mainMentor,
            coMentor,
            createdDate,
            modifiedDate
        } = req.body;
        try {
            await db.query(
                `INSERT INTO project 
                (p_ID, p_nameEN, p_nameTH, s_name1, s_name2, s_code1, s_code2, mainMentor, coMentor, createdDate, modifiedDate)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [p_ID, p_nameEN, p_nameTH, s_name1, s_name2, s_code1, s_code2, mainMentor, coMentor, createdDate, modifiedDate]
            );
            res.status(201).json({ message: 'Project created successfully' });
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
        try {
            const [result] = await db.query(
                `UPDATE project SET 
                    p_nameEN = ?, 
                    p_nameTH = ?, 
                    s_name1 = ?, 
                    s_name2 = ?, 
                    s_code1 = ?, 
                    s_code2 = ?, 
                    mainMentor = ?, 
                    coMentor = ?, 
                    modifiedDate = ?
                WHERE p_ID = ?`,
                [p_nameEN, p_nameTH, s_name1, s_name2, s_code1, s_code2, mainMentor, coMentor, modifiedDate, id]
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