import { useState } from 'react';
import axios from 'axios';
import Navbar from '../component/navbar';

function Profile() {
    const [searchName, setSearchName] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [projectStatus, setProjectStatus] = useState(null);

    const handleSearch = async () => {
        if (!searchName.trim()) return;
        try {
            const res = await axios.get(`http://localhost:8000/student?name=${encodeURIComponent(searchName)}`);
            setSearchResult(res.data);
            setSelectedIndex(null);
            setProjectStatus(null);
        } catch (error) {
            setSearchResult([]);
            setSelectedIndex(null);
            setProjectStatus(null);
        }
    };

    const handleProjectStatus = async (pj) => {
        try {
            const res = await axios.post(
                'http://localhost:8000/project/search',
                { searchResult: pj.p_nameTH || pj.p_nameEN }
            );
            setProjectStatus(res.data);
        } catch (error) {
            setProjectStatus(null);
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
                        onKeyDown={e => {
                            if (e.key === "Enter" && searchName.trim()) {
                                handleSearch();
                            }
                        }}
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
                        {selectedIndex === null ? (
                            <div className="flex flex-col gap-2">
                                {searchResult.map((pj, idx) => (
                                    <button
                                        key={idx}
                                        className="text-left border rounded-xl px-4 py-2 shadow bg-white hover:bg-gray-100 transition"
                                        onClick={() => {
                                            setSelectedIndex(idx);
                                            handleProjectStatus(pj);
                                        }}
                                    >
                                        <div className="font-semibold">
                                            {pj.p_nameTH || pj.p_nameEN || 'ไม่มีชื่อโปรเจค'}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {pj.s_name1} {pj.s_code1}
                                            {pj.s_name2 ? `, ${pj.s_name2} ${pj.s_code2}` : ''}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            ภาคการศึกษา: {pj.semester}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 p-4 border rounded-2xl bg-gray-50 shadow">
                                <div className="font-bold text-blue-900 mb-2">
                                    รายละเอียดโปรเจค
                                </div>
                                <div>นักศึกษา: {searchResult[selectedIndex].s_code1} {searchResult[selectedIndex].s_name1}</div>
                                <div className="ml-16">{searchResult[selectedIndex].s_code2} {searchResult[selectedIndex].s_name2}</div>
                                <div>
                                    ชื่อโปรเจค: {searchResult[selectedIndex].p_nameTH}
                                </div>
                                <div className="ml-20">
                                    {searchResult[selectedIndex].p_nameEN}
                                </div>
                                <div>
                                    สถานะโปรเจค:{" "}
                                    {projectStatus === null
                                        ? "กำลังโหลด..."
                                        : projectStatus.status
                                            ? projectStatus.status
                                            : "ไม่พบสถานะ"}
                                </div>
                                <div>
                                    อาจารย์ที่ปรึกษาหลัก: {projectStatus && projectStatus.mainMentor ? projectStatus.mainMentor : "-"}
                                </div>
                                <div>
                                    อาจารย์ที่ปรึกษาร่วม: {projectStatus && projectStatus.coMentor ? projectStatus.coMentor : "-"}
                                </div>
                                <div>ภาคการศึกษา: {searchResult[selectedIndex].semester}</div>
                                <div>หมายเหตุ: {searchResult[selectedIndex].note || '-'}</div>
                                <button
                                    className="mt-4 px-4 py-2 bg-gray-300 rounded-3xl text-sm"
                                    onClick={() => {
                                        setSelectedIndex(null);
                                        setProjectStatus(null);
                                    }}
                                >
                                    กลับไปเลือกโปรเจคอื่น
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-gray-500 mt-4">ไม่พบข้อมูล</div>
                )}
            </div>
        </div>
    );
}

export default Profile;