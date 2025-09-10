import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function Navbar({ search, setSearch, selectedSemester, setSelectedSemester }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [semesterList, setSemesterList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [newSemester, setNewSemester] = useState('');
    const [teacherList, setTeacherList] = useState([]);
    const [newTeacher, setNewTeacher] = useState('');
    const [editTeacherId, setEditTeacherId] = useState(null);
    const [editTeacherValue, setEditTeacherValue] = useState('');
    const [isTeacherEditMode, setIsTeacherEditMode] = useState(false);
    const [showAddTeacherInput, setShowAddTeacherInput] = useState(false);
    const [editSemesterId, setEditSemesterId] = useState(null);
    const [editSemesterValue, setEditSemesterValue] = useState('');
    const navigate = useNavigate();
    const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false);
    const semesterDropdownRef = useRef(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showAddInput, setShowAddInput] = useState(false);
    const semesterPattern = /^\d{1}\/\d{4}$/;
    const [internalSearch, setInternalSearch] = useState('');
    const location = useLocation();
    const searchValue = search !== undefined ? search : internalSearch;
    const setSearchValue = setSearch !== undefined ? setSearch : setInternalSearch;

    // โหลดปีการศึกษาทุกครั้งที่ modal เปิดหรือหลังเพิ่ม/ลบ/แก้ไข
    const fetchSemesters = async () => {
        try {
            const res = await axios.get('http://localhost:8000/project/getsemester');
            setSemesterList(res.data);
        } catch (error) {
            console.error('Error fetching semesters:', error);
        }
    };

    // โหลดรายชื่ออาจารย์
    const fetchTeachers = async () => {
        try {
            const res = await axios.get('http://localhost:8000/teacher/all');
            setTeacherList(res.data);
        } catch (error) {
            alert('โหลดรายชื่ออาจารย์ไม่สำเร็จ');
        }
    };

    useEffect(() => {
        fetchSemesters();
        fetchTeachers();
    }, []);

    useEffect(() => {
        if (showModal) {
            fetchSemesters();
        }
    }, [showModal]);

    useEffect(() => {
        if (showTeacherModal) fetchTeachers();
    }, [showTeacherModal]);

    const handleToggle = () => setIsMenuOpen(!isMenuOpen);

    // เพิ่มปีการศึกษา
    const handleAddSemester = async () => {
        if (!newSemester.trim()) return;
        if (!semesterPattern.test(newSemester.trim())) {
            alert('กรุณากรอกปีการศึกษาในรูปแบบ x/xxxx (เช่น 1/2567)');
            return;
        }
        try {
            await axios.post('http://localhost:8000/project/createsemester', { semester: newSemester });
            setNewSemester('');
            setShowModal(false);
            fetchSemesters();
            alert('เพิ่มปีการศึกษาสำเร็จ');
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

    const handleSaveEditSemester = async (id) => {
        if (!editSemesterValue.trim()) return;
        if (!semesterPattern.test(editSemesterValue.trim())) {
            alert('กรุณากรอกปีการศึกษาในรูปแบบ x/xxxx (เช่น 1/2567)');
            return;
        }
        try {
            await axios.put(`http://localhost:8000/project/updatesemester/${id}`, { semester: editSemesterValue });
            setEditSemesterId(null);
            setEditSemesterValue('');
            fetchSemesters();
            alert('แก้ไขปีการศึกษาสำเร็จ');
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

    // เพิ่มอาจารย์
    const handleAddTeacher = async () => {
        if (!newTeacher.trim()) return;
        try {
            await axios.post('http://localhost:8000/teacher/create', { t_name: newTeacher });
            setNewTeacher('');
            setShowAddTeacherInput(false);
            fetchTeachers();
            alert('เพิ่มอาจารย์สำเร็จ');
        } catch (error) {
            alert('เพิ่มอาจารย์ไม่สำเร็จ');
        }
    };
    // ลบอาจารย์
    const handleDeleteTeacher = async (id) => {
        if (!window.confirm('ยืนยันการลบอาจารย์นี้?')) return;
        try {
            await axios.delete(`http://localhost:8000/teacher/delete/${id}`);
            fetchTeachers();
        } catch (error) {
            alert('ลบอาจารย์ไม่สำเร็จ');
        }
    };
    // แก้ไขอาจารย์
    const handleSaveEditTeacher = async (id) => {
        if (!editTeacherValue.trim()) return;
        try {
            await axios.put(`http://localhost:8000/teacher/update/${id}`, { t_name: editTeacherValue });
            setEditTeacherId(null);
            setEditTeacherValue('');
            fetchTeachers();
            alert('แก้ไขชื่ออาจารย์สำเร็จ');
        } catch (error) {
            alert('แก้ไขชื่ออาจารย์ไม่สำเร็จ');
        }
    };

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
                    <div className='flex items-center w-full max-w-lg'>
                        {/* ช่องค้นหา */}
                        <div className="flex-1 flex justify-center min-w-[320px]">
                            {(location.pathname !== "/" && location.pathname !== "/profile") ? (
                                <>
                                    <input
                                        type="text"
                                        className="border border-white bg-transparent px-3 py-2 rounded-full w-80 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#000066] placeholder:text-xs"
                                        placeholder="ค้นหาโปรเจค/นักศึกษา/รหัส/ที่ปรึกษา/สถานะ..."
                                        value={searchValue}
                                        onChange={e => setSearchValue(e.target.value)}
                                    />
                                    {/* ลบปุ่มค้นหาออก */}
                                </>
                            ) : (
                                <div className="w-80 h-10" />
                            )}
                        </div>
                        {/* ดรอปดาวน์เลือกปีการศึกษา */}
                        {location.pathname !== "/" && location.pathname !== "/profile" && (
                            <div className="relative w-36" ref={semesterDropdownRef}>
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
                                    <div className="absolute top-full mt-2 z-50 w-full bg-white border rounded-3xl shadow-lg">
                                        <div className="max-h-[120px] overflow-y-auto pr-1">
                                            {/* เพิ่มตัวเลือก "แสดงทั้งหมด" ที่บนสุด */}
                                            <div
                                                key="all"
                                                className="px-4 py-2 hover:bg-blue-50 hover:text-blue-700 cursor-pointer text-sm text-gray-700 transition-all duration-300 rounded-tl-3xl"
                                                onClick={() => {
                                                    setSelectedSemester('');
                                                    setIsSemesterDropdownOpen(false);
                                                }}
                                            >
                                                แสดงทั้งหมด
                                            </div>
                                            {semesterList.map((sem, idx) => {
                                                const isFirst = idx === 0;
                                                const isLast = idx === semesterList.length - 1;
                                                return (
                                                    <div
                                                        key={sem.id}
                                                        className={
                                                            "px-4 py-2 hover:bg-blue-50 hover:text-blue-700 cursor-pointer text-sm text-gray-700 transition-all duration-300 " +
                                                            (isFirst ? "" : "") +
                                                            (isLast ? "rounded-bl-3xl " : "")
                                                        }
                                                        onClick={() => {
                                                            setSelectedSemester(sem.semester);
                                                            setIsSemesterDropdownOpen(false);
                                                        }}
                                                    >
                                                        {sem.semester}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
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
                    <button
                        className="text-xs block py-2 px-4 text-white hover:bg-white hover:text-black rounded-3xl"
                        onClick={() => setShowTeacherModal(true)}
                    >
                        + เพิ่มอาจารย์
                    </button>
                </div>
            </div>
            {/* Modal สำหรับเพิ่ม/ลบ/แก้ไขปีการศึกษา */}
            {showModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
                    onClick={e => {
                        if (e.target === e.currentTarget) {
                            setShowModal(false);
                            setNewSemester('');
                            setEditSemesterId(null);
                            setIsEditMode(false);
                            setShowAddInput(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-2xl p-5 max-w-md min-w-[250px] mx-auto relative transition-all duration-300 max-h-[50vh] overflow-y-auto">
                        <button
                            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white text-md font-bold shadow transition z-10"
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
                        <h3 className="text-md font-semibold text-black mb-2">จัดการปีการศึกษา</h3>

                        <div className="flex items-center gap-2 mb-2">
                            {!showAddInput ? (
                                <button
                                    className="px-2 py-1 bg-[#000066] text-sm text-white shadow-lg rounded-3xl hover:bg-blue-700 transition-all duration-300 ease-in-out cursor-pointer"
                                    onClick={() => setShowAddInput(true)}
                                >
                                    + เพิ่มปีการศึกษา
                                </button>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        className="border px-3 py-2 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-[#000066]"
                                        style={{ width: "160px" }}
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
                                        บันทึก
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
                            )}
                        </div>

                        <button
                            className="px-3 py-1 mb-4 mt-2 bg-yellow-500 text-white text-sm rounded-3xl shadow-lg hover:bg-yellow-600 transition-all duration-300 ease-in-out ml-auto"
                            onClick={() => {
                                setIsEditMode(!isEditMode);
                                setEditSemesterId(null);
                                setEditSemesterValue('');
                            }}
                        >
                            {isEditMode ? "ปิดโหมดแก้ไข" : "แก้ไข"}
                        </button>

                        {/* ส่วนที่ scroll ได้เมื่อรายการเยอะ */}
                        <div className="max-h-[30vh] overflow-y-auto pr-1">
                            {semesterList.map(sem => (
                                <div
                                    key={sem.id}
                                    className="flex flex-wrap items-center gap-2 mb-2 w-full"
                                    style={{ minWidth: 0 }}
                                >
                                    {isEditMode ? (
                                        <>
                                            <button
                                                className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300"
                                                onClick={() => handleDeleteSemester(sem.id)}
                                                title="ลบ"
                                                type="button"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 16 16">
                                                    <circle cx="5" cy="5" r="5" fill="none" />
                                                    <rect x="4" y="7.25" width="8" height="1.5" rx="0.75" fill="#fff" />
                                                </svg>
                                            </button>
                                            <input
                                                type="text"
                                                className="mt-1 text-sm border px-2 py-1 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                style={{ width: "100px", minWidth: 0 }}
                                                value={editSemesterId === sem.id ? editSemesterValue : sem.semester}
                                                onChange={e => {
                                                    setEditSemesterId(sem.id);
                                                    setEditSemesterValue(e.target.value);
                                                }}
                                            />
                                            <button
                                                className="mt-1 px-2 py-1 bg-green-600 text-white text-sm rounded-3xl shadow-lg hover:bg-green-700 transition-all duration-300 ease-in-out"
                                                onClick={() => handleSaveEditSemester(sem.id)}
                                                disabled={
                                                    editSemesterId !== sem.id ||
                                                    !editSemesterValue.trim() ||
                                                    editSemesterValue === sem.semester
                                                }
                                            >
                                                บันทึก
                                            </button>
                                            <button
                                                className="mt-1 px-2 py-1 bg-gray-400 text-sm text-white rounded-3xl shadow-lg hover:bg-gray-500 transition-all duration-300 ease-in-out"
                                                onClick={() => {
                                                    setEditSemesterId(null);
                                                    setEditSemesterValue('');
                                                }}
                                                disabled={editSemesterId !== sem.id}
                                            >
                                                ยกเลิก
                                            </button>
                                        </>
                                    ) : (
                                        <span className="flex-1 truncate">{sem.semester}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {/* Modal สำหรับเพิ่ม/ลบ/แก้ไขอาจารย์ */}
            {showTeacherModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
                    onClick={e => {
                        if (e.target === e.currentTarget) {
                            setShowTeacherModal(false);
                            setNewTeacher('');
                            setEditTeacherId(null);
                            setIsTeacherEditMode(false);
                            setShowAddTeacherInput(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-2xl p-5 max-w-md min-w-[250px] mx-auto relative transition-all duration-300 max-h-[50vh] overflow-y-auto">
                        <button
                            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white text-md font-bold shadow transition z-10"
                            onClick={() => {
                                setShowTeacherModal(false);
                                setNewTeacher('');
                                setEditTeacherId(null);
                                setIsTeacherEditMode(false);
                            }}
                            aria-label="ปิด"
                        >
                            ✕
                        </button>
                        <h3 className="text-md font-semibold text-black mb-2">จัดการอาจารย์</h3>

                        <div className="flex items-center gap-2 mb-2">
                            {!showAddTeacherInput ? (
                                <button
                                    className="px-2 py-1 bg-[#000066] text-sm text-white shadow-lg rounded-3xl hover:bg-blue-700 transition-all duration-300 ease-in-out cursor-pointer"
                                    onClick={() => setShowAddTeacherInput(true)}
                                >
                                    + เพิ่มอาจารย์
                                </button>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        className="border px-3 py-2 rounded-3xl text-sm focus:outline-none focus:ring-2 focus:ring-[#000066]"
                                        style={{ width: "160px" }}
                                        placeholder="กรอกตัวย่ออาจารย์"
                                        value={newTeacher}
                                        onChange={e => setNewTeacher(e.target.value)}
                                    />
                                    <button
                                        className="px-2 py-1 bg-[#000066] text-sm text-white shadow-lg rounded-3xl hover:bg-blue-700 transition-all duration-300 ease-in-out cursor-pointer"
                                        onClick={handleAddTeacher}
                                        disabled={!newTeacher.trim()}
                                    >
                                        บันทึก
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-gray-400 text-sm text-white rounded-3xl shadow-lg hover:bg-gray-500 transition-all duration-300 ease-in-out"
                                        onClick={() => {
                                            setShowAddTeacherInput(false);
                                            setNewTeacher('');
                                        }}
                                    >
                                        ยกเลิก
                                    </button>
                                </>
                            )}
                        </div>

                        <button
                            className="px-3 py-1 mb-4 mt-2 bg-yellow-500 text-white text-sm rounded-3xl shadow-lg hover:bg-yellow-600 transition-all duration-300 ease-in-out ml-auto"
                            onClick={() => {
                                setIsTeacherEditMode(!isTeacherEditMode);
                                setEditTeacherId(null);
                                setEditTeacherValue('');
                            }}
                        >
                            {isTeacherEditMode ? "ปิดโหมดแก้ไข" : "แก้ไข"}
                        </button>

                        {/* ส่วนที่ scroll ได้เมื่อรายการเยอะ */}
                        <div className="max-h-[30vh] overflow-y-auto pr-1">
                            {teacherList.map(teacher => (
                                <div
                                    key={teacher.t_ID}
                                    className="flex flex-wrap items-center gap-2 mb-2 w-full"
                                    style={{ minWidth: 0 }}
                                >
                                    {isTeacherEditMode ? (
                                        <>
                                            <button
                                                className="mt-1 flex items-center justify-center w-5 h-5 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300"
                                                onClick={() => handleDeleteTeacher(teacher.t_ID)}
                                                title="ลบ"
                                                type="button"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 16 16">
                                                    <circle cx="5" cy="5" r="5" fill="none" />
                                                    <rect x="4" y="7.25" width="8" height="1.5" rx="0.75" fill="#fff" />
                                                </svg>
                                            </button>
                                            <input
                                                type="text"
                                                className="mt-1 text-sm border px-2 py-1 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                style={{ width: "100px", minWidth: 0 }}
                                                value={editTeacherId === teacher.t_ID ? editTeacherValue : teacher.t_name}
                                                onChange={e => {
                                                    setEditTeacherId(teacher.t_ID);
                                                    setEditTeacherValue(e.target.value);
                                                }}
                                            />
                                            <button
                                                className="mt-1 px-2 py-1 bg-green-600 text-white text-sm rounded-3xl shadow-lg hover:bg-green-700 transition-all duration-300 ease-in-out"
                                                onClick={() => handleSaveEditTeacher(teacher.t_ID)}
                                                disabled={
                                                    editTeacherId !== teacher.t_ID ||
                                                    !editTeacherValue.trim() ||
                                                    editTeacherValue === teacher.t_name
                                                }
                                            >
                                                บันทึก
                                            </button>
                                            <button
                                                className="mt-1 px-2 py-1 bg-gray-400 text-sm text-white rounded-3xl shadow-lg hover:bg-gray-500 transition-all duration-300 ease-in-out"
                                                onClick={() => {
                                                    setEditTeacherId(null);
                                                    setEditTeacherValue('');
                                                }}
                                                disabled={editTeacherId !== teacher.t_ID}
                                            >
                                                ยกเลิก
                                            </button>
                                        </>
                                    ) : (
                                        <span className="flex-1 truncate">{teacher.t_name}</span>
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