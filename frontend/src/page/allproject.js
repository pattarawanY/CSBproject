// แสดงโปรเจคทั้งหมดที่ถูกแอดเข้ามา แสดงสถานะว่าผ่านเจค1แล้ว หรือผ่านเจค2แล้ว ถ้ายังไม่ผ่านให้แสดงว่าทำไมยังไม่ผ่าน(ติดอะไร)
// หน้านี้ต้องค้นหาจากปีการศึกษา ชื่อเจค ชื่อนศ รหัสนศ
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/navbar';

function AllProject() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('http://localhost:8000/project/all'); // ปรับ endpoint ตาม backend ของคุณ
                setProjects(res.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">โปรเจคทั้งหมด</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table-fixed w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="w-[40px] px-2 py-1 border text-xs text-center">ลำดับ</th>
                                    <th className="w-[180px] px-4 py-2 border text-xs text-center">ชื่อโปรเจค</th>
                                    <th className="w-[120px] px-4 py-2 border text-xs text-center">ชื่อนักศึกษา</th>
                                    <th className="w-[100px] px-4 py-2 border text-xs text-center">รหัสนักศึกษา</th>
                                    <th className="w-[60px] px-2 py-1 border text-xs text-center">ปีการศึกษา</th>
                                    <th className="w-[100px] px-2 py-1 border text-xs text-center">ที่ปรึกษาหลัก</th>
                                    <th className="w-[100px] px-2 py-1 border text-xs text-center">ที่ปรึกษาร่วม</th>
                                    <th className="w-[120px] px-2 py-1 border text-xs text-center">หมายเหตุ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-6 text-gray-500 text-sm">
                                            ไม่มีข้อมูล
                                        </td>
                                    </tr>
                                ) : (
                                    projects.map((p, idx) => (
                                        <tr key={p.p_ID || idx} className="bg-white">
                                            <td className="px-2 py-1 border text-xs text-center">{idx + 1}</td>
                                            <td className="px-4 py-2 border text-xs text-left">
                                                {p.p_nameEN}<br />{p.p_nameTH}
                                            </td>
                                            <td className="px-4 py-2 border text-xs text-left">
                                                {p.s_name1}<br />{p.s_name2}
                                            </td>
                                            <td className="px-4 py-2 border text-xs text-left">
                                                {p.s_code1}<br />{p.s_code2}
                                            </td>
                                            <td className="px-2 py-1 border text-xs text-center">{p.yearPj1 || '-'}</td>
                                            <td className="px-2 py-1 border text-xs text-left">{p.mainMentor || '-'}</td>
                                            <td className="px-2 py-1 border text-xs text-left">{p.coMentor || '-'}</td>
                                            <td className="px-2 py-1 border text-xs text-left">{p.note || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AllProject;