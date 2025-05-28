import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/navbar';

function Project1() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState(null);
    const [formData, setFormData] = useState({});
    const [project1Data, setProject1Data] = useState({});

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

    const handleSave = async (index) => {
        const p_ID = projects[index].p_ID;
        // สมมติคุณเก็บค่าจาก input ใน state เช่น formData
        const data = {
            p_ID,
            mentorStatus: formData.mentorStatus,   // จาก radio แต่งตั้งที่ปรึกษา
            docStatus: formData.docStatus,         // จาก radio ยื่นเอกสารขอสอบ
            gradePj1: formData.gradePj1,           // จาก input ผลสอบ
            yearPj1: formData.yearPj1,             // จาก input ปีการศึกษา
            modifiedDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        try {
            // ตรวจสอบว่ามีข้อมูลใน project1 สำหรับ p_ID นี้หรือยัง
            const res = await axios.get(`http://localhost:8000/project1/${p_ID}`);
            if (res.data && res.data.pj1_ID) {
                // มีข้อมูลแล้ว → update
                await axios.put(`http://localhost:8000/project1/update/${res.data.pj1_ID}`, data);
                alert('อัปเดตข้อมูลสำเร็จ');
            } else {
                // ยังไม่มี → create
                data.createdDate = data.modifiedDate;
                await axios.post('http://localhost:8000/project1/create', data);
                alert('บันทึกข้อมูลใหม่สำเร็จ');
            }
        } catch (error) {
            // ถ้า error 404 แปลว่ายังไม่มีข้อมูล → create
            if (error.response && error.response.status === 404) {
                data.createdDate = data.modifiedDate;
                await axios.post('http://localhost:8000/project1/create', data);
                alert('บันทึกข้อมูลใหม่สำเร็จ');
            } else {
                alert('เกิดข้อผิดพลาด');
                console.error(error);
            }
        }
        setEditIndex(null);
    };

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-start bg-gray-100 p-8">
                <h2 className="text-2xl font-semibold mb-4">รายการโปรเจค</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="px-4 py-2 border text-xs max-w-[7px] min-w-[7px] break-words whitespace-normal">ลำดับ</th>
                                    <th className="px-4 py-2 border text-xs max-w-[120px] min-w-[120px] break-words whitespace-normal">ชื่อโปรเจค (TH)</th>
                                    <th className="px-4 py-2 border text-xs max-w-[120px] min-w-[120px] break-words whitespace-normal">ชื่อโปรเจค (EN)</th>
                                    <th className="px-4 py-2 border text-xs max-w-[80px] min-w-[80px] break-words whitespace-normal">ชื่อนศ. 1</th>
                                    <th className="px-4 py-2 border text-xs max-w-[80px] min-w-[80px] break-words whitespace-normal">ชื่อนศ. 2</th>
                                    <th className="px-4 py-2 border text-xs max-w-[50px] min-w-[50px] break-words whitespace-normal">รหัสนศ. 1</th>
                                    <th className="px-4 py-2 border text-xs max-w-[50px] min-w-[50px] break-words whitespace-normal">รหัสนศ. 2</th>
                                    <th className="px-4 py-2 border text-xs max-w-[30px] min-w-[30px] break-words whitespace-normal">ที่ปรึกษาหลัก</th>
                                    <th className="px-4 py-2 border text-xs max-w-[30px] min-w-[30px] break-words whitespace-normal">ที่ปรึกษาร่วม</th>

                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((p, index) => {
                                    const pj1 = project1Data[p.p_ID];
                                    return (
                                        <>
                                            <tr key={`main-${p.p_ID}`} className="bg-white">
                                                <td className="px-4 py-2 border text-xs text-center">{p.p_ID}</td>
                                                <td className="px-4 py-2 border text-xs text-center">{p.p_nameTH}</td>
                                                <td className="px-4 py-2 border text-xs text-center">{p.p_nameEN}</td>
                                                <td className="px-4 py-2 border text-xs text-center">{p.s_name1}</td>
                                                <td className="px-4 py-2 border text-xs text-center">{p.s_name2}</td>
                                                <td className="px-4 py-2 border text-xs text-center">{p.s_code1}</td>
                                                <td className="px-4 py-2 border text-xs text-center">{p.s_code2}</td>
                                                <td className="px-4 py-2 border text-xs text-center">{p.mainMentor}</td>
                                                <td className="px-4 py-2 border text-xs text-center">{p.coMentor}</td>
                                            </tr>
                                            <tr key={`status-${p.p_ID}`} className="bg-gray-50 text-xs">
                                                <td colSpan={9} className="px-4 py-2 border">
                                                    <div className="flex items-start divide-x divide-gray-300">
                                                        {/* แต่งตั้งที่ปรึกษา */}
                                                        <div className="flex items-center px-4 gap-2">
                                                            <label className="flex items-center gap-1">
                                                                <span className="font-semibold">แต่งตั้งที่ปรึกษา</span>
                                                                <input
                                                                    type="radio"
                                                                    name={`mentorStatus-${index}`}
                                                                    value="1"
                                                                    checked={editIndex === index
                                                                        ? formData.mentorStatus === '1'
                                                                        : pj1
                                                                            ? String(pj1.mentorStatus) === '1'
                                                                            : false
                                                                    }
                                                                    onChange={() => setFormData({ ...formData, mentorStatus: '1' })}
                                                                    disabled={editIndex !== index}
                                                                    className="ml-2 accent-[#000066]"
                                                                />
                                                                <span className="text-xs">แต่งตั้งแล้ว</span>
                                                                <input
                                                                    type="radio"
                                                                    name={`mentorStatus-${index}`}
                                                                    value="0"
                                                                    checked={editIndex === index
                                                                        ? formData.mentorStatus === '0'
                                                                        : pj1
                                                                            ? String(pj1.mentorStatus) === '0'
                                                                            : false
                                                                    }
                                                                    onChange={() => setFormData({ ...formData, mentorStatus: '0' })}
                                                                    disabled={editIndex !== index}
                                                                    className="ml-4 accent-[#000066]"
                                                                />
                                                                <span className="text-xs">ยังไม่แต่งตั้ง</span>
                                                            </label>
                                                        </div>
                                                        {/* ยื่นเอกสารขอสอบ */}
                                                        <div className="flex items-center px-4 gap-2">
                                                            <label className="flex items-center gap-1">
                                                                <span className="font-semibold">ยื่นเอกสารขอสอบ</span>
                                                                <input
                                                                    type="radio"
                                                                    name={`docStatus-${index}`}
                                                                    value="1"
                                                                    checked={editIndex === index
                                                                        ? formData.docStatus === '1'
                                                                        : pj1
                                                                            ? String(pj1.docStatus) === '1'
                                                                            : false
                                                                    }
                                                                    onChange={() => setFormData({ ...formData, docStatus: '1' })}
                                                                    disabled={editIndex !== index}
                                                                    className="ml-2"
                                                                />
                                                                <span className="text-xs">ยื่นเอกสารแล้ว</span>
                                                                <input
                                                                    type="radio"
                                                                    name={`docStatus-${index}`}
                                                                    value="0"
                                                                    checked={editIndex === index
                                                                        ? formData.docStatus === '0'
                                                                        : pj1
                                                                            ? String(pj1.docStatus) === '0'
                                                                            : false
                                                                    }
                                                                    onChange={() => setFormData({ ...formData, docStatus: '0' })}
                                                                    disabled={editIndex !== index}
                                                                    className="ml-4"
                                                                />
                                                                <span className="text-xs">ยังไม่ยื่นเอกสาร</span>
                                                            </label>
                                                        </div>
                                                        {/* ปีการศึกษา */}
                                                        <div className="flex items-center px-4 gap-2">
                                                            <label>
                                                                <span className="font-semibold">ปีการศึกษา</span>
                                                                <input
                                                                    type="text"
                                                                    value={editIndex === index
                                                                        ? formData.yearPj1
                                                                        : pj1
                                                                            ? pj1.yearPj1 || '-'
                                                                            : '-'
                                                                    }
                                                                    onChange={e => setFormData({ ...formData, yearPj1: e.target.value })}
                                                                    className="ml-2 border px-1 py-0.5 text-xs w-24"
                                                                    disabled={editIndex !== index}
                                                                />
                                                            </label>
                                                        </div>
                                                        {/* ผลสอบ */}
                                                        <div className="flex items-center px-4 gap-2">
                                                            <label>
                                                                <span className="font-semibold">ผลการสอบ</span>
                                                                <input
                                                                    type="text"
                                                                    value={editIndex === index ? formData.gradePj1 : pj1 ? pj1.gradePj1 || '-' : '-'}
                                                                    onChange={e => setFormData({ ...formData, gradePj1: e.target.value })}
                                                                    className="ml-2 border px-1 py-0.5 text-xs w-24"
                                                                    disabled={editIndex !== index}
                                                                />
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center px-4 ml-auto divide-x-0">
                                                            {editIndex === index ? (
                                                                <>
                                                                    <button
                                                                        className="underline text-green-600 hover:text-green-800 bg-transparent font-semibold text-xs shadow-none border-none mr-2"
                                                                        type="button"
                                                                        onClick={() => handleSave(index)}
                                                                    >
                                                                        บันทึก
                                                                    </button>
                                                                    <button
                                                                        className="underline text-red-600 hover:text-red-800 bg-transparent font-semibold text-xs shadow-none border-none"
                                                                        type="button"
                                                                        onClick={() => setEditIndex(null)}
                                                                    >
                                                                        ยกเลิก
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <button
                                                                    className="underline text-[#000066] hover:text-yellow-500 bg-transparent font-semibold text-xs shadow-none border-none"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFormData({
                                                                            mentorStatus: pj1 && pj1.mentorStatus !== undefined ? String(pj1.mentorStatus) : '',
                                                                            docStatus: pj1 && pj1.docStatus !== undefined ? String(pj1.docStatus) : '',
                                                                            gradePj1: pj1?.gradePj1 || '',
                                                                            yearPj1: pj1?.yearPj1 || ''
                                                                        });
                                                                        setEditIndex(index);
                                                                    }}
                                                                >
                                                                    แก้ไข
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Project1;