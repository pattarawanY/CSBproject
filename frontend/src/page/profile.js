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
            setSearchResult(res.data); // res.data เป็น array
        } catch (error) {
            setSearchResult([]);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-xl mx-auto mt-20 p-4">
                <h2 className="text-lg font-semibold mb-4">ค้นหาข้อมูลนักศึกษา</h2>
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        className="border px-3 py-2 rounded-3xl text-sm w-full"
                        placeholder="ค้นหาด้วยชื่อ,รหัสนักศึกษา,ชื่อโปรเจค"
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
                {searchResult && searchResult.length > 0 ? (
                    <div className="mt-4">
                        {searchResult.map((pj, idx) => (
                            <div key={idx} className="mb-4 border-b pb-2">
                                <div>ชื่อนักศึกษาคนที่ 1: {pj.s_name1}  รหัสนักศึกษาคนที่ 1: {pj.s_code1}</div>
                                <div>ชื่อนักศึกษาคนที่ 2: {pj.s_name2}  รหัสนักศึกษาคนที่ 2: {pj.s_code2}</div>
                                <div>ชื่อโปรเจค: {pj.p_nameEN} {pj.p_nameTH}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 mt-4">ไม่พบข้อมูล</div>
                )}
            </div>
        </div>
    );
}

export default Profile;