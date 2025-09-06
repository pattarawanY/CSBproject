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

    async getSemester(req, res) {
        // ตาราง semester (id, semester(varchar))
        try {
            // แยกปี (หลัง /) และเทอม (ก่อน /) แล้ว sort ปีมาก่อน เทอมทีหลัง
            const [rows] = await db.query(`
                SELECT * FROM semester
                ORDER BY 
                    CAST(SUBSTRING_INDEX(semester, '/', -1) AS UNSIGNED) ASC,
                    CAST(SUBSTRING_INDEX(semester, '/', 1) AS UNSIGNED) ASC
            `);
            res.json(rows);
        } catch (error) {
            console.error('Error fetching semesters:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async createSemester(req, res) {
        // ตาราง semester (id, semester(varchar))
        const { semester } = req.body;
        if (!semester) {
            return res.status(400).json({ error: 'semester is required' });
        }
        try {
            const [result] = await db.query(
                'INSERT INTO semester (semester) VALUES (?)',
                [semester]
            );
            res.status(201).json({ id: result.insertId, semester });
        } catch (error) {
            console.error('Error creating semester:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deleteSemester(req, res) {
        // ตาราง semester (id, semester(varchar))
        const { id } = req.params;
        try {
            const [result] = await db.query(
                'DELETE FROM semester WHERE id = ?',
                [id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Semester not found' });
            }
            res.json({ message: 'Semester deleted successfully' });
        } catch (error) {
            console.error('Error deleting semester:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async updateSemester(req, res) {
        // ตาราง semester (id, semester(varchar))
        const { id } = req.params;
        const { semester } = req.body;
        if (!semester) {
            return res.status(400).json({ error: 'semester is required' });
        }
        try {
            const [result] = await db.query(
                'UPDATE semester SET semester = ? WHERE id = ?',
                [semester, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Semester not found' });
            }
            res.json({ message: 'Semester updated successfully' });
        } catch (error) {
            console.error('Error updating semester:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async getPjStatusBySearchResult(req, res) {
        const { searchResult } = req.body;
        try {
            // 1. หา p_ID จากชื่อโปรเจค
            const [rows] = await db.query(
                'SELECT * FROM project WHERE p_nameTH = ? OR p_nameEN = ?',
                [searchResult, searchResult]
            );
            if (rows.length === 0) {
                return res.json({ found: false, status: "ไม่พบโปรเจค" });
            }
            const project = rows[0];
            const p_ID = project.p_ID;

            // 2. หาใน project1 ด้วย p_ID
            const [pj1Rows] = await db.query(
                'SELECT * FROM project1 WHERE p_ID = ?',
                [p_ID]
            );
            if (pj1Rows.length === 0) {
                // ดึงชื่ออาจารย์
                const mainMentorName = await getTeacherName(project.mainMentor);
                const coMentorName = await getTeacherName(project.coMentor);
                return res.json({
                    found: true,
                    status: "ยังไม่สอบโปรเจค",
                    mainMentor: mainMentorName,
                    coMentor: coMentorName
                });
            }

            // 3. เช็ค pass ใน project1
            if (pj1Rows[0].pass != 1) {
                const mainMentorName = await getTeacherName(project.mainMentor);
                const coMentorName = await getTeacherName(project.coMentor);
                return res.json({
                    found: true,
                    status: "กำลังสอบก้าวหน้า",
                    mainMentor: mainMentorName,
                    coMentor: coMentorName
                });
            }

            // 4. หาใน project2 ด้วย pj1_ID
            const pj1_ID = pj1Rows[0].pj1_ID;
            const [pj2Rows] = await db.query(
                'SELECT passStatus2 FROM project2 WHERE pj1_ID = ?',
                [pj1_ID]
            );
            const mainMentorName = await getTeacherName(project.mainMentor);
            const coMentorName = await getTeacherName(project.coMentor);

            if (pj2Rows.length === 0) {
                return res.json({
                    found: true,
                    status: "กำลังสอบป้องกัน",
                    mainMentor: mainMentorName,
                    coMentor: coMentorName
                });
            }

            // 5. เช็ค passStatus2 ใน project2
            if (pj2Rows[0].passStatus2 == 1) {
                return res.json({
                    found: true,
                    status: "ผ่านทั้งหมดแล้ว",
                    mainMentor: mainMentorName,
                    coMentor: coMentorName
                });
            } else {
                return res.json({
                    found: true,
                    status: "กำลังสอบป้องกัน",
                    mainMentor: mainMentorName,
                    coMentor: coMentorName
                });
            }
        } catch (error) {
            console.error('Error fetching project status:', error);
            res.status(500).json({ error: 'Internal server error' });
        }

        // ฟังก์ชันช่วยค้นหาชื่ออาจารย์
        async function getTeacherName(t_ID) {
            if (!t_ID) return "";
            const [rows] = await db.query('SELECT t_name FROM teacher WHERE t_ID = ?', [t_ID]);
            return rows.length > 0 ? rows[0].t_name : "";
        }
    }
}

module.exports = ProjectController;