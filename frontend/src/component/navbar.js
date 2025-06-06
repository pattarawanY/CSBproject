import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [semesterList, setSemesterList] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newSemester, setNewSemester] = useState('');
    const [editSemesterId, setEditSemesterId] = useState(null);
    const [editSemesterValue, setEditSemesterValue] = useState('');
    const navigate = useNavigate();
    const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false);
    const semesterDropdownRef = useRef(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showAddInput, setShowAddInput] = useState(false);

    // โหลดปีการศึกษาทุกครั้งที่ modal เปิดหรือหลังเพิ่ม/ลบ/แก้ไข
    const fetchSemesters = async () => {
        try {
            const res = await axios.get('http://localhost:8000/project/getsemester');
            setSemesterList(res.data);
        } catch (error) {
            console.error('Error fetching semesters:', error);
        }
    };

    useEffect(() => {
        fetchSemesters();
    }, []);

    useEffect(() => {
        if (showModal) {
            fetchSemesters();
        }
    }, [showModal]);

    const handleToggle = () => setIsMenuOpen(!isMenuOpen);

    // เพิ่มปีการศึกษา
    const handleAddSemester = async () => {
        if (!newSemester.trim()) return;
        try {
            await axios.post('http://localhost:8000/project/createsemester', { semester: newSemester });
            setNewSemester('');
            setShowModal(false);
            fetchSemesters();
        } catch (error) {
            alert('เพิ่มปีการศึกษาไม่สำเร็จ');
        }
    };

    // ลบปีการศึกษา
    const handleDeleteSemester = async (id) => {
        if (!window.confirm('ยืนยันการลบปีการศึกษานี้?')) return;
        try {
            await axios.delete(`http://localhost:8000/project/deletesemester/${id}`);
            fetchSemesters();
        } catch (error) {
            alert('ลบปีการศึกษาไม่สำเร็จ');
        }
    };

    // แก้ไขปีการศึกษา
    const handleEditSemester = (id, value) => {
        setEditSemesterId(id);
        setEditSemesterValue(value);
    };
    const handleSaveEditSemester = async (id) => {
        if (!editSemesterValue.trim()) return;
        try {
            await axios.put(`http://localhost:8000/project/updatesemester/${id}`, { semester: editSemesterValue });
            setEditSemesterId(null);
            setEditSemesterValue('');
            fetchSemesters();
        } catch (error) {
            alert('แก้ไขปีการศึกษาไม่สำเร็จ');
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (semesterDropdownRef.current && !semesterDropdownRef.current.contains(event.target)) {
                setIsSemesterDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <nav className="bg-[#000066] p-4 fixed top-0 left-0 w-full z-50 print:hidden">
                <div className="flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button onClick={handleToggle} className="text-white text-xl z-10">
                            {isMenuOpen ? '✕' : '☰'}
                        </button>
                        <div className="text-white text-lg font-semibold">
                            CSB project management
                        </div>
                    </div>
                    {/* ดรอปดาวน์เลือกปีการศึกษา */}
                    <div className="relative w-32" ref={semesterDropdownRef}>
                        <div
                            className="px-3 py-2 border rounded-3xl bg-white text-[#000066] cursor-pointer focus:outline-none text-xs hover:bg-gray-200 hover:text-[#000066] transition-all duration-300 ease-in-out flex items-center justify-between shadow-lg"
                            onClick={() => setIsSemesterDropdownOpen(!isSemesterDropdownOpen)}
                        >
                            {selectedSemester || 'เลือกปีการศึกษา'}
                            <span className={`transform transition-transform duration-300 ${isSemesterDropdownOpen ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </div>
                        {isSemesterDropdownOpen && (
                            <div className="absolute top-full mt-2 z-50 w-full max-h-48 overflow-y-auto bg-white border rounded-3xl shadow-lg">
                                {semesterList.map((sem) => (
                                    <div
                                        key={sem.id}
                                        className="px-4 py-2 hover:bg-blue-50 hover:text-blue-700 cursor-pointer text-sm text-gray-700 transition-all duration-300"
                                        onClick={() => {
                                            setSelectedSemester(sem.semester);
                                            setIsSemesterDropdownOpen(false);
                                        }}
                                    >
                                        {sem.semester}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            <div
                className={`fixed top-0 left-0 h-full bg-[#000066] text-white transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 ease-in-out z-40 overflow-y-auto print:hidden`}
                style={{ width: '240px' }}
            >
                <button
                    onClick={handleToggle}
                    className="text-white text-xl absolute top-4 right-4"
                >
                    ✕
                </button>
                <div className="p-4 mt-16">
                    <NavLink
                        to="/"
                        className="text-sm block py-2 px-4 text-white hover:bg-white hover:text-black rounded-3xl"
                        onClick={handleToggle}
                    >
                        เพิ่มโปรเจค
                    </NavLink>
                    <NavLink
                        to="/profile"
                        className="text-sm block py-2 px-4 text-white hover:bg-white hover:text-black rounded-3xl"
                        onClick={handleToggle}
                    >
                        ค้นหาโปรเจค
                    </NavLink>
                    <NavLink
                        to="/allproject"
                        className="text-sm block py-2 px-4 text-white hover:bg-white hover:text-black rounded-3xl"
                        onClick={handleToggle}
                    >
                        โปรเจคทั้งหมด(เฉพาะCSB)
                    </NavLink>
                    <NavLink
                        to="/project1"
                        className="text-sm block py-2 px-4 text-white hover:bg-white hover:text-black rounded-3xl"
                        onClick={handleToggle}
                    >
                        ตารางการสอบก้าวหน้า
                    </NavLink>
                    <NavLink
                        to="/project2"
                        className="text-sm block py-2 px-4 text-white hover:bg-white hover:text-black rounded-3xl"
                        onClick={handleToggle}
                    >
                        ตารางการสอบป้องกัน
                    </NavLink>
                    <hr className="my-4 border-gray-300 w-44 mx-auto" />
                    <button
                        className="text-xs block py-2 px-4 text-white hover:bg-white hover:text-black rounded-3xl"
                        onClick={() => setShowModal(true)}
                    >
                        + เพิ่มปีการศึกษา
                    </button>
                </div>
            </div>
            {/* Modal สำหรับเพิ่ม/ลบ/แก้ไขปีการศึกษา */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg pt-6 pr-6 pb-6 pl-6 w-96 relative overflow-visible">
                        <button
                            className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white text-lg font-bold shadow transition"
                            onClick={() => {
                                setShowModal(false);
                                setNewSemester('');
                                setEditSemesterId(null);
                                setIsEditMode(false);
                            }}
                            aria-label="ปิด"
                        >
                            ✕
                        </button>
                        {/* ปุ่มปิด modal แบบกากบาท */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-md font-semibold text-black">จัดการปีการศึกษา</h3>
                            <button
                                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-3xl shadow-lg hover:bg-yellow-600 transition-all duration-300 ease-in-out"
                                onClick={() => {
                                    setIsEditMode(!isEditMode);
                                    setEditSemesterId(null);
                                    setEditSemesterValue('');
                                }}
                            >
                                {isEditMode ? "ปิดโหมดแก้ไข" : "แก้ไข"}
                            </button>
                        </div>
                        <div className="mb-4 flex gap-2">
                            <input
                                type="text"
                                className="border px-3 py-2 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-[#000066]"
                                style={{ width: "225px" }}
                                placeholder="เช่น 1/2567"
                                value={newSemester}
                                onChange={e => setNewSemester(e.target.value)}
                            />
                            {showAddInput ? (
                                <>
                                    <input
                                        type="text"
                                        className="border px-3 py-2 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-[#000066]"
                                        style={{ width: "225px" }}
                                        placeholder="เช่น 1/2567"
                                        value={newSemester}
                                        onChange={e => setNewSemester(e.target.value)}
                                    />
                                    <button
                                        className="px-2 py-1 bg-[#000066] text-sm text-white shadow-lg rounded-3xl hover:bg-blue-700 transition-all duration-300 ease-in-out cursor-pointer"
                                        onClick={async () => {
                                            await handleAddSemester();
                                            setShowAddInput(false);
                                        }}
                                        disabled={!newSemester.trim()}
                                    >
                                        เพิ่มปีการศึกษา
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-gray-400 text-sm text-white rounded-3xl shadow-lg hover:bg-gray-500 transition-all duration-300 ease-in-out"
                                        onClick={() => {
                                            setShowAddInput(false);
                                            setNewSemester('');
                                        }}
                                    >
                                        ยกเลิก
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="px-2 py-1 bg-[#000066] text-sm text-white shadow-lg rounded-3xl hover:bg-blue-700 transition-all duration-300 ease-in-out cursor-pointer"
                                    onClick={async () => {
                                        await handleAddSemester();
                                        setShowAddInput(false);
                                    }}
                                    disabled={!newSemester.trim()}
                                >
                                    เพิ่มปีการศึกษา
                                </button>
                            )}
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                            {semesterList.map(sem => (
                                <div key={sem.id} className="flex items-center gap-2 ml-2 mb-2">
                                    {isEditMode ? (
                                        <>
                                            <button
                                                className="flex items-center justify-center w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300 mr-2"
                                                onClick={() => handleDeleteSemester(sem.id)}
                                                title="ลบ"
                                                type="button"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 16 16">
                                                    <circle cx="8" cy="8" r="8" fill="none" />
                                                    <rect x="4" y="7.25" width="8" height="1.5" rx="0.75" fill="#fff" />
                                                </svg>
                                            </button>
                                            <input
                                                type="text"
                                                className="mt-2 text-sm border px-3 py-2 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                style={{ width: "150px" }}
                                                value={editSemesterId === sem.id ? editSemesterValue : sem.semester}
                                                disabled={editSemesterId !== sem.id}
                                                onChange={e => editSemesterId === sem.id && setEditSemesterValue(e.target.value)}
                                            />
                                            <button
                                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-3xl shadow-lg hover:bg-green-700 transition-all duration-300 ease-in-out"
                                                onClick={() => handleSaveEditSemester(sem.id)}
                                                disabled={editSemesterId !== sem.id || !editSemesterValue.trim()}
                                            >
                                                บันทึก
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-gray-400 text-sm text-white rounded-3xl shadow-lg hover:bg-gray-500 transition-all duration-300 ease-in-out"
                                                onClick={() => {
                                                    setEditSemesterId(null);
                                                    setEditSemesterValue('');
                                                }}
                                            >
                                                ยกเลิก
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span className="flex-1">{sem.semester}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;