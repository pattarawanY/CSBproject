import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../component/navbar';

function Assign() {
    const [teachers, setTeachers] = useState([]);
    const [selectedAdvisor, setSelectedAdvisor] = useState(null);
    const [selectedCoAdvisor, setSelectedCoAdvisor] = useState(null);
    const [isAdvisorDropdownOpen, setIsAdvisorDropdownOpen] = useState(false);
    const [isCoAdvisorDropdownOpen, setIsCoAdvisorDropdownOpen] = useState(false);
    const advisorDropdownRef = useRef(null);
    const coAdvisorDropdownRef = useRef(null);
    const [projectNameTH, setProjectNameTH] = useState('');
    const [projectNameEN, setProjectNameEN] = useState('');
    const [student1, setStudent1] = useState('');
    const [student2, setStudent2] = useState('');
    const [studentId1, setStudentId1] = useState('');
    const [studentId2, setStudentId2] = useState('');
    const [semester, setSemester] = useState('');

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/teacher/all');
                setTeachers(response.data);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };
        fetchTeachers();
    }, []);

    // ปิด dropdown เมื่อคลิกรอบนอก
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (advisorDropdownRef.current && !advisorDropdownRef.current.contains(event.target)) {
                setIsAdvisorDropdownOpen(false);
            }
            if (coAdvisorDropdownRef.current && !coAdvisorDropdownRef.current.contains(event.target)) {
                setIsCoAdvisorDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleReset = () => {
        setProjectNameTH('');
        setProjectNameEN('');
        setStudent1('');
        setStudent2('');
        setStudentId1('');
        setStudentId2('');
        setSelectedAdvisor(null);
        setSelectedCoAdvisor(null);
        setSemester('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedAdvisor && selectedCoAdvisor && selectedAdvisor === selectedCoAdvisor) {
            alert('ที่ปรึกษาหลักกับที่ปรึกษาร่วมต้องไม่ใช่คนเดียวกัน');
            return;
        }

        if (selectedAdvisor && selectedCoAdvisor && selectedAdvisor === selectedCoAdvisor) {
            alert('ที่ปรึกษาหลักกับที่ปรึกษาร่วมต้องไม่ใช่คนเดียวกัน');
            return;
        }

        if (!selectedAdvisor && selectedCoAdvisor) {
            alert('กรณีมีที่ปรึกษาร่วม ต้องมีที่ปรึกษาหลักก่อน');
            return;
        }

        // สร้างข้อมูลที่จะส่ง
        const data = {
            // สามารถสร้าง p_ID เป็น uuid หรือปล่อยให้ backend สร้างเอง
            p_nameEN: projectNameEN,
            p_nameTH: projectNameTH,
            s_name1: student1,
            s_name2: student2,
            s_code1: studentId1,
            s_code2: studentId2,
            mainMentor: selectedAdvisor ? selectedAdvisor : null,
            coMentor: selectedCoAdvisor ? selectedCoAdvisor : null,
            semester: semester,
            yearPj1: semester,
            createdDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
            modifiedDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        try {
            await axios.post('http://localhost:8000/project/create', data);
            alert('บันทึกข้อมูลสำเร็จ');
            // รีเซ็ตฟอร์มหรือทำอย่างอื่นตามต้องการ
            handleReset();
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            console.error(error);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center mt-20">
                <form className="w-full max-w-5xl flex gap-8" onSubmit={handleSubmit}>
                    <div className="flex-1 space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold text-gray-800">ข้อมูลโปรเจค</h2>
                            <button
                                type="button"
                                className="underline text-red-600 hover:text-black transition-all duration-300 ease-in-out text-xs"
                                onClick={handleReset}
                            >
                                รีเซ็ตข้อมูลที่กรอก
                            </button>
                        </div>
                        <div>
                            <label className="block mb-1 text-sm text-gray-600">ชื่อโปรเจค(ไทย)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#000066]"
                                placeholder="ชื่อโปรเจค (ไทย)"
                                required
                                value={projectNameTH}
                                onChange={e => setProjectNameTH(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm text-gray-600">ชื่อโปรเจค(อังกฤษ)</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#000066]"
                                placeholder="ชื่อโปรเจค (อังกฤษ)"
                                required
                                value={projectNameEN}
                                onChange={e => setProjectNameEN(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block mb-1 text-sm text-gray-600">ชื่อนักศึกษา(คนที่1)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#000066]"
                                    placeholder="ชื่อนักศึกษา (คนที่1)"
                                    required
                                    value={student1}
                                    onChange={e => setStudent1(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block mb-1 text-sm text-gray-600">ชื่อนักศึกษา(คนที่2)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#000066]"
                                    placeholder="ชื่อนักศึกษา (คนที่2)"
                                    required
                                    value={student2}
                                    onChange={e => setStudent2(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block mb-1 text-sm text-gray-600">รหัสนักศึกษา(คนที่1)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#000066]"
                                    placeholder="รหัสนักศึกษา (คนที่1)"
                                    value={studentId1}
                                    onChange={e => setStudentId1(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block mb-1 text-sm text-gray-600">รหัสนักศึกษา(คนที่2)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#000066]"
                                    placeholder="รหัสนักศึกษา (คนที่2)"
                                    required
                                    value={studentId2}
                                    onChange={e => setStudentId2(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {/* Advisor Dropdown */}
                            <div className="flex-1 relative" ref={advisorDropdownRef}>
                                <label className="block mb-1 text-sm text-gray-600">ที่ปรึกษาหลัก</label>
                                <div
                                    className="px-4 py-2 border rounded-3xl bg-white cursor-pointer focus:outline-none text-sm hover:bg-gray-100 hover:text-blue-600 transition-all duration-300 ease-in-out flex items-center justify-between"
                                    onClick={() => setIsAdvisorDropdownOpen(!isAdvisorDropdownOpen)}
                                >
                                    {teachers.find(t => t.t_ID === selectedAdvisor)?.t_name || '-- เลือกที่ปรึกษาหลัก --'}
                                    <span className={`ml-2 transform transition-transform duration-300 ${isAdvisorDropdownOpen ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </div>
                                {isAdvisorDropdownOpen && (
                                    <div className="absolute bottom-full mb-2 z-50 w-full max-h-48 overflow-y-auto bg-white border rounded-3xl shadow-lg">

                                        <div
                                            className="px-4 py-2 text-gray-500 hover:bg-gray-100 cursor-pointer text-sm"
                                            onClick={() => {
                                                setSelectedAdvisor(null);
                                                setIsAdvisorDropdownOpen(false);
                                            }}
                                        >
                                            - ไม่มีที่ปรึกษาหลัก -
                                        </div>
                                        {teachers.map(teacher => (
                                            <div
                                                key={teacher.t_ID}
                                                className="px-4 py-2 hover:bg-blue-50 hover:text-blue-700 cursor-pointer text-sm text-gray-700 transition-all duration-300"
                                                onClick={() => {
                                                    setSelectedAdvisor(teacher.t_ID);
                                                    setIsAdvisorDropdownOpen(false);
                                                }}
                                            >
                                                {teacher.t_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Co-Advisor Dropdown */}
                            <div className="flex-1 relative" ref={coAdvisorDropdownRef}>
                                <label className="block mb-1 text-sm text-gray-600">ที่ปรึกษาร่วม</label>
                                <div
                                    className="px-4 py-2 border rounded-3xl bg-white cursor-pointer focus:outline-none text-sm hover:bg-gray-100 hover:text-blue-600 transition-all duration-300 ease-in-out flex items-center justify-between"
                                    onClick={() => setIsCoAdvisorDropdownOpen(!isCoAdvisorDropdownOpen)}
                                >
                                    {teachers.find(t => t.t_ID === selectedCoAdvisor)?.t_name || '-- เลือกที่ปรึกษาร่วม --'}
                                    <span className={`ml-2 transform transition-transform duration-300 ${isCoAdvisorDropdownOpen ? 'rotate-180' : ''}`}>
                                        ▼
                                    </span>
                                </div>
                                {isCoAdvisorDropdownOpen && (
                                    <div className="absolute bottom-full mb-2 z-50 w-full max-h-48 overflow-y-auto bg-white border rounded-3xl shadow-lg">

                                        <div
                                            className="px-4 py-2 text-gray-500 hover:bg-gray-100 cursor-pointer text-sm"
                                            onClick={() => {
                                                setSelectedCoAdvisor(null);
                                                setIsCoAdvisorDropdownOpen(false);
                                            }}
                                        >
                                            - ไม่มีที่ปรึกษาร่วม -
                                        </div>
                                        {teachers.map(teacher => (
                                            <div
                                                key={teacher.t_ID}
                                                className="px-4 py-2 hover:bg-blue-50 hover:text-blue-700 cursor-pointer text-sm text-gray-700 transition-all duration-300"
                                                onClick={() => {
                                                    setSelectedCoAdvisor(teacher.t_ID);
                                                    setIsCoAdvisorDropdownOpen(false);
                                                }}
                                            >
                                                {teacher.t_name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <label className="block mb-1 text-sm text-gray-600">ปีการศึกษา</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#000066]"
                                    placeholder="ปีที่เข้าระบบ เช่น 2/2566"
                                    required
                                    value={semester}
                                    onChange={e => setSemester(e.target.value)}
                                    name="semester"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-1/2 bg-[#000066] justify-center hover:bg-green-600 text-white py-2 hover:scale-105 rounded-3xl shadow-xl transition-all duration-300 ease-in-out"
                            >
                                ยืนยัน
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Assign;