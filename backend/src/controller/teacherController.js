const db = require('../db');

const TeacherController = {
    async getAllTeachers(req, res) {
        try {
            const [rows] = await db.query('SELECT * FROM teacher');
            res.json(rows);
        } catch (error) {
            console.error('Error fetching teacher :', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getTeacherById(req, res) {
        const teacherId = req.params.id;
        try {
            const [rows] = await db.query('SELECT * FROM teacher WHERE t_ID = ?', [teacherId]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Teacher not found' });
            }
            res.json(rows[0]);
        } catch (error) {
            console.error('Error fetching teacher by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async createTeacher(req, res) {
        const { t_name } = req.body;
        try {
            const [result] = await db.query('INSERT INTO teacher (t_name) VALUES (?)', [t_name]);
            res.status(201).json({ id: result.insertId, t_name });
        } catch (error) {
            console.error('Error creating teacher:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async updateTeacher(req, res) {
        const teacherId = req.params.id;
        const { t_name } = req.body;
        try {
            const [result] = await db.query('UPDATE teacher SET t_name = ? WHERE t_ID = ?', [t_name, teacherId]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Teacher not found' });
            }
            res.json({ message: 'Teacher updated successfully' });
        } catch (error) {
            console.error('Error updating teacher:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deleteTeacher(req, res) {
        const teacherId = req.params.id;
        try {
            const [result] = await db.query('DELETE FROM teacher WHERE t_ID = ?', [teacherId]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Teacher not found' });
            }
            res.json({ message: 'Teacher deleted successfully' });
        } catch (error) {
            console.error('Error deleting teacher:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getMentorNamesForAllProjects(req, res) {
        try {
            const [rows] = await db.query(`
            SELECT 
                p.p_ID,
                pj1.pj1_ID,
                p.p_nameEN,
                p.p_nameTH,
                p.s_name1,
                p.s_name2,
                p.s_code1,
                p.s_code2,
                p.semester,
                p.note,
                t1.t_name AS mainMentorName,
                t2.t_name AS coMentorName
            FROM project p
            LEFT JOIN project1 pj1 ON p.p_ID = pj1.p_ID
            LEFT JOIN teacher t1 ON p.mainMentor = t1.t_ID
            LEFT JOIN teacher t2 ON p.coMentor = t2.t_ID
        `);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching mentor names for all projects:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    
    async updateMentorandCoMentorByProjectID(req, res) {
        try {
            const { projectId } = req.params;
            const { mainMentor, coMentor } = req.body;

            const [result] = await db.query(
                'UPDATE project SET mainMentor = ?, coMentor = ? WHERE p_ID = ?',
                [mainMentor || null, coMentor || null, projectId]
            );

            res.json({ success: true, affectedRows: result.affectedRows });
        } catch (error) {
            console.error('Error updating mentor and co-mentor by project ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

}

module.exports = TeacherController;