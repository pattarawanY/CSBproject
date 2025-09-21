import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/navbar';

function AllProject() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [projectsWithStatus, setProjectsWithStatus] = useState([]);
    const [yearPass2Map, setYearPass2Map] = useState(new Map());

    useEffect(() => {
        const fetchTeachername = async () => {
            try {
                const res = await axios.get('http://localhost:8000/teacher/project-mentors');
                setProjects(res.data);
                console.log('projects', res.data); // <--- เพิ่มบรรทัดนี้
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTeachername();
    }, []);

    useEffect(() => {
        // สำหรับคอลัมสถานะ
        // เคส 1 : สถานะ"กำลังสอบก้าวหน้า"
        // เช็คในดาต้าเบสตารางproject1 ข้อมูลในคอลัมpass == 0

        // เคส 2 : สถานะ"กำลังสอบป้องกัน"
        // เช็คในดาต้าเบสตารางproject1 ข้อมูลในคอลัมpass == 1 และมีข้อมูลpj1_IDนั้นในตารางproject2(ตรงกัน)

        // เคส 3 : สถานะ"ผ่านทั้งหมดแล้ว"
        // เช็คในดาต้าเบสตารางproject2 มีข้อมูลทุกคอลัม
        const fetchStatuses = async () => {
            try {
                const [pj1Res, pj2Res] = await Promise.all([
                    axios.get('http://localhost:8000/project1/'),
                    axios.get('http://localhost:8000/project2/')
                ]);
                const pj1List = pj1Res.data;
                const pj2List = pj2Res.data;

                const merged = projects.map(p => {
                    const pj1 = pj1List.find(x => x.p_ID.toString() === p.p_ID.toString());
                    const pj2 = pj1 ? pj2List.find(x => x.pj1_ID.toString() === pj1.pj1_ID.toString()) : undefined;

                    console.log('p.p_ID:', p.p_ID);
                    console.log('pj1:', pj1);
                    console.log('pj2:', pj2);

                    let statusLabel = 'ยังไม่เข้าสอบ';

                    if (pj2 && pj2.gradePj2 && pj2.gradePj2 !== '' && pj2.gradePj2 !== 0) {
                        statusLabel = 'ผ่านทั้งหมดแล้ว';
                        if ((!pj2.gradeSend1 || pj2.gradeSend1 === 0) && (!pj2.gradeSend2 || pj2.gradeSend2 === 0)) {
                            return { ...p, statusLabel, note: 'ยังไม่ส่งเกรด' };
                        }
                        return { ...p, statusLabel, note: p.note };
                    }
                    else if (pj2 && (!pj2.gradePj2 || pj2.gradePj2 === '' || pj2.gradePj2 === 0)) {
                        statusLabel = 'กำลังสอบป้องกัน';
                        return { ...p, statusLabel, note: p.note };
                    }
                    else if (pj1 && pj1.pass === 0) {
                        statusLabel = 'กำลังสอบก้าวหน้า';
                        return { ...p, statusLabel, note: p.note };
                    }
                    else {
                        return { ...p, statusLabel, note: p.note };
                    }
                });

                setProjectsWithStatus(merged);
            } catch (error) {
                console.error('Error fetching statuses:', error);
            }
        };
        if (projects.length > 0) {
            fetchStatuses();
        } else {
            setProjectsWithStatus([]);
        }
    }, [projects]);

    useEffect(() => {
        const fetchYearPass2 = async () => {
            try {
                const res = await axios.get('http://localhost:8000/project2/yearpass2');
                const map = new Map();
                res.data.forEach(row => {
                    map.set(row.pj1_ID, row.yearPass2);
                });
                setYearPass2Map(map);
            } catch (error) {
                console.error('Error fetching yearPass2:', error);
            }
        };
        fetchYearPass2();
    }, []);

    const filteredProjects = projectsWithStatus.filter(p => {
        const q = search.toLowerCase();
        const matchSearch =
            (p.p_nameEN && p.p_nameEN.toLowerCase().includes(q)) ||
            (p.p_nameTH && p.p_nameTH.toLowerCase().includes(q)) ||
            (p.s_name1 && p.s_name1.toLowerCase().includes(q)) ||
            (p.s_name2 && p.s_name2.toLowerCase().includes(q)) ||
            (p.s_code1 && p.s_code1.toLowerCase().includes(q)) ||
            (p.s_code2 && p.s_code2.toLowerCase().includes(q)) ||
            (p.mainMentorName && p.mainMentorName.toLowerCase().includes(q)) ||
            (p.coMentorName && p.coMentorName.toLowerCase().includes(q)) ||
            (p.note && p.note.toLowerCase().includes(q));
        const matchSemester = !selectedSemester || p.semester === selectedSemester;
        return matchSearch && matchSemester;
    });

    return (
        <div>
            <Navbar search={search} setSearch={setSearch} selectedSemester={selectedSemester} setSelectedSemester={setSelectedSemester} />
            <div className="flex flex-col h-screen">
                <div className="flex-1 mt-10 flex flex-col items-left justify-start bg-gray-100 p-8">
                    <div className="flex items-center gap-4 mb-4 mt-4">
                        <h2 className="text-lg font-semibold">โปรเจคทั้งหมด(เฉพาะCSB)</h2>
                    </div>
                    <div className="flex items-center gap-4 w-full">
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="table-fixed w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200 text-gray-700">
                                            <th className="w-[12px] px-2 py-1 border text-xs text-center">ลำดับ</th>
                                            <th className="w-[120px] px-4 py-2 border text-xs text-center">ชื่อโปรเจค</th>
                                            <th className="w-[120px] px-4 py-2 border text-xs text-center">ชื่อนักศึกษา</th>
                                            <th className="w-[42px] px-4 py-2 border text-xs text-center">รหัสนักศึกษา</th>
                                            <th className="w-[32px] px-2 py-1 border text-xs text-center">ที่ปรึกษาหลัก</th>
                                            <th className="w-[32px] px-2 py-1 border text-xs text-center">ที่ปรึกษาร่วม</th>
                                            <th className="w-[42px] px-2 py-1 border text-xs text-center">สถานะ</th>
                                            <th className="w-[36px] px-2 py-1 border text-xs text-center">ปีที่ผ่าน</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredProjects.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="text-center py-6 text-gray-500 text-sm border"
                                                >
                                                    ไม่มีข้อมูล
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredProjects.map((p, idx) => (
                                                <tr key={p.p_ID || idx} className="bg-white">
                                                    <td className="px-2 py-1 border text-xs text-center">{idx + 1}</td>

                                                    <td className="px-4 py-2 border text-xs text-left">
                                                        {p.p_nameEN}
                                                        <br />
                                                        {p.p_nameTH}
                                                    </td>

                                                    <td className="px-4 py-2 border text-xs text-left">
                                                        {p.s_name1}
                                                        <br />
                                                        {p.s_name2}
                                                    </td>

                                                    <td className="px-4 py-2 border text-xs text-left">
                                                        {p.s_code1}
                                                        <br />
                                                        {p.s_code2}
                                                    </td>

                                                    <td className="px-2 py-1 border text-center text-xs">
                                                        {p.mainMentorName || '-'}
                                                    </td>

                                                    <td className="px-2 py-1 border text-center text-xs">
                                                        {p.coMentorName || '-'}
                                                    </td>

                                                    <td className="px-2 py-1 border text-xs text-center">
                                                        {p.statusLabel || '-'}
                                                    </td>

                                                    <td className="px-2 py-1 border text-xs text-center">
                                                        {p.statusLabel === 'ผ่านทั้งหมดแล้ว'
                                                            ? yearPass2Map.get(String(p.p_ID)) || '-'
                                                            : '-'}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllProject;