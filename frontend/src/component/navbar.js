import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [semesterList, setSemesterList] = useState(['1/2567', '2/2566', '1/2566']);
    const [selectedSemester, setSelectedSemester] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newSemester, setNewSemester] = useState('');
    const navigate = useNavigate();
    const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false);
    const semesterDropdownRef = useRef(null);

    const handleToggle = () => setIsMenuOpen(!isMenuOpen);

    const handleAddSemester = () => {
        if (newSemester && !semesterList.includes(newSemester)) {
            setSemesterList(prev => [newSemester, ...prev]);
            setSelectedSemester(newSemester);
        }
        setShowModal(false);
        setNewSemester('');
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
                                {semesterList.map((sem, idx) => (
                                    <div
                                        key={idx}
                                        className="px-4 py-2 hover:bg-blue-50 hover:text-blue-700 cursor-pointer text-sm text-gray-700 transition-all duration-300"
                                        onClick={() => {
                                            setSelectedSemester(sem);
                                            setIsSemesterDropdownOpen(false);
                                        }}
                                    >
                                        {sem}
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
            {/* Modal สำหรับเพิ่มปีการศึกษา */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded-lg p-6 w-80">
                        <h3 className="text-lg font-semibold mb-4 text-[#000066]">เพิ่มปีการศึกษา</h3>
                        <input
                            type="text"
                            className="w-full border px-3 py-2 rounded mb-4"
                            placeholder="เช่น 1/2567"
                            value={newSemester}
                            onChange={e => setNewSemester(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-1 bg-gray-300 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className="px-4 py-1 bg-[#000066] text-white rounded"
                                onClick={handleAddSemester}
                                disabled={!newSemester}
                            >
                                เพิ่ม
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;