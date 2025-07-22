// แสดงข้อมูลของนศคนนั้นว่าโปรเจคถึงไหนแล้ว กรณีผ่านเจค1แล้วให้แสดงทั้งเจค1 เจค2เลย ถ้ายังไม่ผ่านเจค1ให้ส่วนเจค2ขึ้นว่าไม่มีข้อมูล
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/navbar';

function Profile() {
    const [student, setStudent] = useState({});
    const [projects, setProjects] = useState([]);
    const [pj1, setPj1] = useState(null);
    const [pj2, setPj2] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [searchResult, setSearchResult] = useState(null);

    const handleSearch = async () => {
        if (!searchName.trim()) return;
        try {
            const res = await axios.get(`http://localhost:8000/student?name=${encodeURIComponent(searchName)}`);
            setSearchResult(res.data);
        } catch (error) {
            setSearchResult(null);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-xl mx-auto mt-20 p-4 bg-white rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">ค้นหาข้อมูลนักศึกษา</h2>
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        className="border px-3 py-2 rounded-3xl text-sm w-full"
                        placeholder="กรอกชื่อนักศึกษา"
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                    />
                    <button
                        className="px-4 py-2 bg-[#000066] text-white rounded-3xl text-sm"
                        onClick={handleSearch}
                        disabled={!searchName.trim()}
                    >
                        ค้นหา
                    </button>
                </div>
                {searchResult && (
                    <div className="mt-4">
                        {/* แสดงข้อมูลนักศึกษาและโปรเจคที่ค้นเจอ */}
                        <div>ชื่อ: {searchResult.name}</div>
                        <div>รหัส: {searchResult.code}</div>
                        {/* เพิ่มข้อมูลโปรเจคตามที่ต้องการ */}
                    </div>
                )}
                {!searchResult && (
                    <div className="text-gray-500 mt-4">ไม่พบข้อมูลนักศึกษา</div>
                )}
            </div>
        </div>
    );
}

export default Profile;