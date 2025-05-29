// แสดงเจคที่อยู่ในขั้นโปรเจค1 ให้แยกเป็นอันที่ผ่านกับยังไม่ผ่าน
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/navbar';

function Project1() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState(null);
    const [formData, setFormData] = useState({});
    const [project1Data, setProject1Data] = useState({});
    const [mode, setMode] = useState('notpass');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('http://localhost:8000/project/all');
                setProjects(res.data);

                // โหลดข้อมูล project1 ของแต่ละ p_ID
                const project1Obj = {};
                await Promise.all(res.data.map(async (p) => {
                    try {
                        const pj1 = await axios.get(`http://localhost:8000/project1/${p.p_ID}`);
                        project1Obj[p.p_ID] = pj1.data;
                    } catch (err) {
                        // ถ้าไม่มีข้อมูล (404) ให้เก็บเป็น null
                        project1Obj[p.p_ID] = null;
                    }
                }));
                setProject1Data(project1Obj);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p => {
        const pj1 = project1Data[p.p_ID];
        if (mode === 'pending') {
            // แสดงเฉพาะโปรเจคที่ยังไม่มีข้อมูลใน project1 (ยังไม่ได้กรอกสถานะ)
            return !pj1;
        }
        if (!pj1) return mode === 'notpass' || mode === 'notyet';

        const isMentor = String(pj1.mentorStatus ?? '0') === '1';
        const isDoc = String(pj1.docStatus ?? '0') === '1';
        const hasGrade = pj1.gradePj1 && pj1.gradePj1 !== '';
        const isPass = isMentor && isDoc && hasGrade && pj1.gradePj1 !== 'F';
        const isFail = isMentor && isDoc && hasGrade && pj1.gradePj1 === 'F';
        const isNotYet = isMentor && isDoc && !hasGrade;

        if (mode === 'pass') return isPass;
        if (mode === 'fail') return isFail;
        if (mode === 'notyet') return isNotYet;
        // notpass: ยังไม่ครบเงื่อนไขสอบผ่าน, ไม่ใช่สอบตก, ไม่ใช่ยังไม่ได้สอบ
        return !(isPass || isFail || isNotYet);
    });

    const handleEdit = (index, p) => {
        setEditIndex(index);
        setFormData({
            mentorStatus: false,
            docStatus: false,
            p_ID: p.p_ID
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleCancel = () => {
        setEditIndex(null);
        setFormData({});
    };

    const handleSave = async (index) => {
        const data = {
            p_ID: formData.p_ID,
            mentorStatus: formData.mentorStatus ? 1 : 0,
            docStatus: formData.docStatus ? 1 : 0,
            gradePj1: '', // ยังไม่กรอกเกรด
            yearPj1: '',  // ยังไม่กรอกปี
            createdDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
            modifiedDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
        try {
            await axios.post('http://localhost:8000/project1/create', data);
            alert('บันทึกข้อมูลสำเร็จ');
            setEditIndex(null);
            setFormData({});
            window.location.reload();
        } catch (error) {
            alert('เกิดข้อผิดพลาด');
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex-1 mt-10 flex flex-col items-left justify-start bg-gray-100 p-8">
                <div className="flex items-center gap-4 w-full">
                    <h2 className="text-lg font-semibold mb-2">การสอบก้าวหน้า</h2>
                    <div className="flex justify-between gap-2 flex-wrap flex-1 mt-2">
                        <div className="flex gap-2 mb-4 flex-wrap">
                            <button
                                className={`px-3 py-2 rounded-3xl text-sm ${mode === 'pass' ? 'bg-[#000066] text-white shadow-lg' : 'bg-gray-200 text-[#000066]'}`}
                                onClick={() => setMode('pass')}
                            >
                                โปรเจคที่สอบก้าวหน้าผ่านแล้ว
                            </button>
                            <button
                                className={`px-3 py-2 rounded-3xl text-sm ${mode === 'fail' ? 'bg-[#000066] text-white shadow-lg' : 'bg-gray-200 text-[#000066]'}`}
                                onClick={() => setMode('fail')}
                            >
                                โปรเจคที่สอบก้าวหน้าไม่ผ่าน
                            </button>
                            <button
                                className={`px-3 py-2 rounded-3xl text-sm ${mode === 'notyet' ? 'bg-[#000066] text-white shadow-lg' : 'bg-gray-200 text-[#000066]'}`}
                                onClick={() => setMode('notyet')}
                            >
                                โปรเจคที่ยังไม่สอบ/รอสอบก้าวหน้า
                            </button>
                            <button
                                className={`px-3 py-2 rounded-3xl text-sm ${mode === 'pending' ? 'bg-[#000066] text-white shadow-lg' : 'bg-gray-200 text-[#000066]'}`}
                                onClick={() => setMode('pending')}
                            >
                                โปรเจคที่รอกรอกสถานะ
                            </button>
                        </div>
                        <button className='underline text-[#000066] hover:text-yellow-500 bg-transparent font-semibold text-xs shadow-none border-none'>
                            แก้ไขข้อมูล
                        </button>
                    </div>
                </div>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="w-[32px] px-1 py-1 border text-[10px] text-center whitespace-normal">ลำดับ</th>
                                    <th className="px-4 py-2 border text-xs max-w-[120px] min-w-[120px] break-words whitespace-normal">ชื่อโปรเจค</th>
                                    <th className="px-4 py-2 border text-xs max-w-[80px] min-w-[80px] break-words whitespace-normal">ชื่อนักศึกษา</th>
                                    <th className="px-4 py-2 border text-xs max-w-[50px] min-w-[50px] break-words whitespace-normal">รหัสนักศึกษา</th>
                                    <th className="px-4 py-2 border text-xs max-w-[32px] min-w-[32px] break-words whitespace-normal">แต่งตั้งที่ปรึกษา</th>
                                    <th className="px-4 py-2 border text-xs max-w-[32px] min-w-[32px] break-words whitespace-normal">เอกสารขอสอบ</th>
                                    <th className="px-4 py-2 border text-xs max-w-[12px] min-w-[12px] break-words whitespace-normal">เกรด</th>
                                    <th className="px-4 py-2 border text-xs max-w-[36px] min-w-[36px] break-words whitespace-normal">หมายเหตุ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.map((p, index) => {
                                    const pj1 = project1Data[p.p_ID];
                                    // const isEditing = editIndex === index; // ไม่ต้องใช้แล้ว
                                    return (
                                        <tr key={`main-${p.p_ID}`} className="bg-white">
                                            <td className="px-4 py-2 border text-xs text-center">{index + 1}</td>
                                            <td className="px-4 py-2 border text-xs text-center">
                                                <div>
                                                    <div className="text-black">{p.p_nameEN}</div>
                                                    <div className="text-black">{p.p_nameTH}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border text-xs text-center">
                                                <div>
                                                    <div>{p.s_name1}</div>
                                                    <div>{p.s_name2}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border text-xs text-center">
                                                <div>
                                                    <div>{p.s_code1}</div>
                                                    <div>{p.s_code2}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 border text-xs text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={pj1 ? String(pj1.mentorStatus ?? '0') === '1' : false}
                                                    onChange={() => { /* เพิ่ม logic ที่ต้องการ */ }}
                                                />
                                            </td>
                                            <td className="px-4 py-2 border text-xs text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={pj1 ? String(pj1.docStatus ?? '0') === '1' : false}
                                                    onChange={() => { /* เพิ่ม logic ที่ต้องการ */ }}
                                                />
                                            </td>
                                            <td className="px-4 py-2 border text-xs text-center">{pj1 ? pj1.gradePj1 : '-'}</td>
                                            <td className="px-4 py-2 border text-xs text-center">{/* หมายเหตุ */}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div >
    );
}

export default Project1;