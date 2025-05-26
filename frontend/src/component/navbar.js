import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleToggle = () => setIsMenuOpen(!isMenuOpen);

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
                <div className="p-4">
                    <h2 className="text-lg font-bold mb-4">เมนู</h2>
                    
                        <NavLink
                            to="/"
                            className="block py-2 px-4 text-white hover:bg-white hover:text-black rounded-3xl"
                            onClick={handleToggle}
                        >
                            เพิ่มโปรเจค
                        </NavLink>
                    
                    <NavLink
                        to="/profile"
                        className="block py-2 px-4 text-white hover:bg-white hover:text-black rounded-3xl"
                        onClick={handleToggle}
                    >
                        ค้นหาโปรเจค
                    </NavLink>
                    <NavLink
                        to="/project1"
                        className="block py-2 px-4 text-white hover:bg-white hover:text-black rounded-3xl"
                        onClick={handleToggle}
                    >
                        ตารางการสอบก้าวหน้า
                    </NavLink>
                    <NavLink
                        to="/project2"
                        className="block py-2 px-4 text-white hover:bg-white hover:text-black rounded-3xl"
                        onClick={handleToggle}
                    >
                        ตารางการสอบป้องกัน
                    </NavLink>
                </div>
            </div>
        </div>
    );
}

export default Navbar;