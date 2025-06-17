import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/navbar';

function filterProjects(projects, mode) {
    return projects.filter(p => {
        // Helper สำหรับเช็คช่องที่ต้องมีข้อมูล
        const hasAllMainFields = [
            p.p_nameTH, p.p_nameEN,
            p.s_name1, p.s_code1,
            (p.s_name2 || 'ok'), (p.s_code2 || 'ok'),
            p.yearPj2
        ].every(val => val !== undefined && val !== null && String(val).trim() !== '');

        // Helper สำหรับเช็ค Eng
        const engCount = [p.engS1, p.engS2].filter(e => e === 1).length;

        // Helper สำหรับเช็คเกรด
        let gradeObj = { grade1: '', grade2: '' };
        try {
            if (p.gradePj2) gradeObj = JSON.parse(p.gradePj2);
        } catch { }
        const allGradeFilled = gradeObj.grade1 && gradeObj.grade2;
        const isFailGrade = ['F', 'FE', 'IP', 'f', 'fe', 'ip'].includes((gradeObj.grade1 || '').toUpperCase()) ||
            ['F', 'FE', 'IP', 'f', 'fe', 'ip'].includes((gradeObj.grade2 || '').toUpperCase());

        if (mode === 'pass') {
            return hasAllMainFields && p.passStatus2 === 1 && allGradeFilled && !isFailGrade;
        }
        if (mode === 'fail') {
            return hasAllMainFields && p.passStatus2 === 0 && allGradeFilled && isFailGrade;
        }
        if (mode === 'eng') {
            return hasAllMainFields && engCount === 1;
        }
        if (mode === 'noTest') {
            return hasAllMainFields && p.test30 !== 1;
        }
        if (mode === 'pendinggrade') {
            return hasAllMainFields && (!p.gradeSend1 || !p.gradeSend2);
        }
        if (mode === 'pending') {
            return (
                [p.p_nameTH, p.p_nameEN, p.s_name1, p.s_code1].some(val => val && String(val).trim() !== '') &&
                !p.yearPj2 && !p.engS1 && !p.engS2 && !p.test30 && !p.docStatus2 && !p.passStatus2 && !p.gradeSend1 && !p.gradeSend2
            );
        }
        return true;
    });
}

function Project2() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [project1Data, setProject1Data] = useState({});
    const [mode, setMode] = useState('all');
    const [checkboxState, setCheckboxState] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [gradeState, setGradeState] = useState({});
    const [remarkState, setRemarkState] = useState({});
    const [yearState, setYearState] = useState({});
    const [editState, setEditState] = useState({});
    const [passState, setPassState] = useState({});
    const [search, setSearch] = useState('');
    const handleEditMode = () => {
        const newEditState = {};
        filteredProjects.forEach(p => {
            newEditState[p.pj2_ID] = {
                p_nameEN: p.p_nameEN,
                p_nameTH: p.p_nameTH,
                s_name1: p.s_name1,
                s_name2: p.s_name2,
                s_code1: p.s_code1,
                s_code2: p.s_code2,
                yearPj2: p.yearPj2,
                gradePj2: p.gradePj2,
                engS1: !!p.engS1,
                engS2: !!p.engS2,
                test30: !!p.test30,
                docStatus2: !!p.docStatus2,
                passStatus2: !!p.passStatus2,
                gradeSend1: !!p.gradeSend1,
                gradeSend2: !!p.gradeSend2,
                note: p.note,
            };
        });
        setEditState(newEditState);
        setIsEditMode(true);
    };
    const handleCancelEdit = () => setIsEditMode(false);

    useEffect(() => {
        const fetchProject2 = async () => {
            try {
                const res = await axios.get('http://localhost:8000/project2/');
                console.log(res.data); // ต้องเห็น p_ID อยู่ในแต่ละ object
                setProjects(res.data);
            } catch (error) {
                console.error('Error fetching project2:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject2();
    }, []);

    useEffect(() => {
        if (Object.keys(project1Data).length > 0) {
            const initial = {};
            projects.forEach(p => {
                const pj1 = project1Data[p.p_ID];
                initial[p.p_ID] = pj1 ? pj1.yearPj1 || '' : '';
            });
            setYearState(initial);
        }
    }, [project1Data, projects]);

    useEffect(() => {
        if (Object.keys(project1Data).length > 0) {
            const initial = {};
            projects.forEach(p => {
                const pj1 = project1Data[p.p_ID];
                initial[p.p_ID] = pj1 ? pj1.remark || '' : '';
            });
            setRemarkState(initial);
        }
    }, [project1Data, projects]);

    useEffect(() => {
        if (Object.keys(project1Data).length > 0) {
            const initial = {};
            projects.forEach(p => {
                const pj1 = project1Data[p.p_ID];
                initial[p.p_ID] = {
                    mentorStatus: pj1 ? String(pj1.mentorStatus ?? '0') === '1' : false,
                    docStatus: pj1 ? String(pj1.docStatus ?? '0') === '1' : false,
                };
            });
            setCheckboxState(initial);
        }
    }, [project1Data, projects]);

    useEffect(() => {
        if (Object.keys(project1Data).length > 0) {
            const initial = {};
            projects.forEach(p => {
                const pj1 = project1Data[p.p_ID];
                initial[p.p_ID] = pj1 ? pj1.gradePj1 || '' : '';
            });
            setGradeState(initial);
        }
    }, [project1Data, projects]);

    useEffect(() => {
        if (Object.keys(project1Data).length > 0) {
            const initial = {};
            projects.forEach(p => {
                const pj1 = project1Data[p.p_ID];
                initial[p.p_ID] = pj1 ? String(pj1.passStatus ?? '0') === '1' : false;
            });
            setPassState(initial);
        }
    }, [project1Data, projects]);

    const filteredProjects = projects.map(p => ({
        p_ID: p.p_ID,
        pj1_ID: p.pj1_ID,
        pj2_ID: p.pj2_ID,
        yearPj2: p.yearPj2,
        gradePj2: p.gradePj2,
        engS1: p.engS1,
        engS2: p.engS2,
        test30: p.test30,
        docStatus2: p.docStatus2,
        gradeSend1: p.gradeSend1,
        gradeSend2: p.gradeSend2,
        createdDate: p.createdDate,
        modifiedDate: p.modifiedDate,
        note: p.note,
        p_nameEN: p.p_nameEN,
        p_nameTH: p.p_nameTH,
        s_name1: p.s_name1,
        s_name2: p.s_name2,
        s_code1: p.s_code1,
        s_code2: p.s_code2,
        passStatus2: p.passStatus2,
    }));

    const handleEditChange = (pj2_ID, field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setEditState(prev => ({
            ...prev,
            [pj2_ID]: {
                ...prev[pj2_ID],
                [field]: value
            }
        }));
    };

    const handleSaveAll = async () => {
        try {
            for (const p of filteredProjects) {
                // 1. อัปเดตข้อมูลตาราง project (ชื่อโปรเจค/นักศึกษา/รหัส)
                console.log("Processing row:", p);
                console.log("p_ID:", p.p_ID); // ต้องไม่ใช่ undefined
                if (
                    p.p_nameEN !== editState[p.pj2_ID]?.p_nameEN ||
                    p.p_nameTH !== editState[p.pj2_ID]?.p_nameTH ||
                    p.s_name1 !== editState[p.pj2_ID]?.s_name1 ||
                    p.s_name2 !== editState[p.pj2_ID]?.s_name2 ||
                    p.s_code1 !== editState[p.pj2_ID]?.s_code1 ||
                    p.s_code2 !== editState[p.pj2_ID]?.s_code2
                ) {
                    // ต้องมี p_ID ในแต่ละแถว (ควร JOIN p_ID มาด้วยจาก backend)
                    await axios.put(`http://localhost:8000/project/update/${p.p_ID}`, {
                        p_nameEN: editState[p.pj2_ID]?.p_nameEN ?? p.p_nameEN,
                        p_nameTH: editState[p.pj2_ID]?.p_nameTH ?? p.p_nameTH,
                        s_name1: editState[p.pj2_ID]?.s_name1 ?? p.s_name1,
                        s_name2: editState[p.pj2_ID]?.s_name2 ?? p.s_name2,
                        s_code1: editState[p.pj2_ID]?.s_code1 ?? p.s_code1,
                        s_code2: editState[p.pj2_ID]?.s_code2 ?? p.s_code2,
                        modifiedDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
                    });
                }

                // 2. อัปเดตข้อมูลตาราง project2 (ฟิลด์อื่นๆ)
                if (
                    editState[p.pj2_ID]?.yearPj2 !== undefined && editState[p.pj2_ID]?.yearPj2 !== p.yearPj2 ||
                    editState[p.pj2_ID]?.gradePj2 !== undefined && editState[p.pj2_ID]?.gradePj2 !== p.gradePj2 ||
                    editState[p.pj2_ID]?.engS1 !== undefined && editState[p.pj2_ID]?.engS1 !== p.engS1 ||
                    editState[p.pj2_ID]?.engS2 !== undefined && editState[p.pj2_ID]?.engS2 !== p.engS2 ||
                    editState[p.pj2_ID]?.test30 !== undefined && editState[p.pj2_ID]?.test30 !== p.test30 ||
                    editState[p.pj2_ID]?.docStatus2 !== undefined && editState[p.pj2_ID]?.docStatus2 !== p.docStatus2 ||
                    editState[p.pj2_ID]?.passStatus2 !== undefined && editState[p.pj2_ID]?.passStatus2 !== p.passStatus2 ||
                    editState[p.pj2_ID]?.gradeSend1 !== undefined && editState[p.pj2_ID]?.gradeSend1 !== p.gradeSend1 ||
                    editState[p.pj2_ID]?.gradeSend2 !== undefined && editState[p.pj2_ID]?.gradeSend2 !== p.gradeSend2 ||
                    editState[p.pj2_ID]?.note !== undefined && editState[p.pj2_ID]?.note !== p.note
                ) {
                    await axios.put(`http://localhost:8000/project2/update/${p.pj2_ID}`, {
                        yearPj2: editState[p.pj2_ID]?.yearPj2 ?? p.yearPj2,
                        gradePj2: editState[p.pj2_ID]?.gradePj2 ?? p.gradePj2,
                        engS1: editState[p.pj2_ID]?.engS1 ? 1 : 0,
                        engS2: editState[p.pj2_ID]?.engS2 ? 1 : 0,
                        test30: editState[p.pj2_ID]?.test30 ? 1 : 0, // <<== ตรงนี้
                        docStatus2: editState[p.pj2_ID]?.docStatus2 ? 1 : 0,
                        passStatus2: editState[p.pj2_ID]?.passStatus2 ? 1 : 0,
                        gradeSend1: editState[p.pj2_ID]?.gradeSend1 ? 1 : 0,
                        gradeSend2: editState[p.pj2_ID]?.gradeSend2 ? 1 : 0,
                        note: editState[p.pj2_ID]?.note ?? p.note,
                        modifiedDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
                    });
                }
            }
            alert('บันทึกข้อมูลสำเร็จ');
            setIsEditMode(false);
            window.location.reload();
        } catch (error) {
            alert('เกิดข้อผิดพลาด');
            console.error(error);
        }
    };

    const displayProjects = filterProjects(filteredProjects, mode);

    return (
        <div className="flex flex-col h-screen">
            <Navbar search={search} setSearch={setSearch} />
            <div className="flex-1 mt-10 flex flex-col items-left justify-start bg-gray-100 p-8">
                <div className="flex items-center gap-4 w-full">
                    <h2 className="text-lg font-semibold mb-2">การสอบป้องกัน</h2>
                    <div className="flex justify-between gap-2 flex-wrap flex-1 mt-2">
                        <div className="flex gap-2 mb-4 flex-wrap">
                            <button
                                className={`px-3 py-2 rounded-3xl text-xs transition-all duration-200
                  ${mode === 'all'
                                        ? 'bg-[#000066] text-white shadow-lg'
                                        : 'bg-gray-200 text-[#000066] hover:bg-yellow-400 hover:text-[#000066] hover:scale-105'
                                    }`}
                                onClick={() => setMode('all')}
                                type="button"
                            >
                                ทั้งหมด
                            </button>
                            <button
                                className={`px-3 py-2 rounded-3xl text-xs transition-all duration-200
                  ${mode === 'pass'
                                        ? 'bg-[#000066] text-white shadow-lg'
                                        : 'bg-gray-200 text-[#000066] hover:bg-yellow-400 hover:text-[#000066] hover:scale-105'
                                    }`}
                                onClick={() => setMode('pass')}
                                type="button"
                            >
                                โปรเจคที่สอบป้องกันผ่านแล้ว
                            </button>
                            <button
                                className={`px-3 py-2 rounded-3xl text-xs transition-all duration-200
                  ${mode === 'fail'
                                        ? 'bg-[#000066] text-white shadow-lg'
                                        : 'bg-gray-200 text-[#000066] hover:bg-yellow-400 hover:text-[#000066] hover:scale-105'
                                    }`}
                                onClick={() => setMode('fail')}
                                type="button"
                            >
                                โปรเจคที่สอบป้องกันไม่ผ่าน
                            </button>
                            <button
                                className={`px-3 py-2 rounded-3xl text-xs transition-all duration-200
                  ${mode === 'eng'
                                        ? 'bg-[#000066] text-white shadow-lg'
                                        : 'bg-gray-200 text-[#000066] hover:bg-yellow-400 hover:text-[#000066] hover:scale-105'
                                    }`}
                                onClick={() => setMode('eng')}
                                type="button"
                            >
                                โปรเจคที่ผลEngไม่ครบ
                            </button>
                            <button
                                className={`px-3 py-2 rounded-3xl text-xs transition-all duration-200
                  ${mode === 'noTest'
                                        ? 'bg-[#000066] text-white shadow-lg'
                                        : 'bg-gray-200 text-[#000066] hover:bg-yellow-400 hover:text-[#000066] hover:scale-105'
                                    }`}
                                onClick={() => setMode('noTest')}
                                type="button"
                            >
                                โปรเจคที่ยังไม่ทดลอง30วัน
                            </button>
                            <button
                                className={`px-3 py-2 rounded-3xl text-xs transition-all duration-200
                  ${mode === 'pendinggrade'
                                        ? 'bg-[#000066] text-white shadow-lg'
                                        : 'bg-gray-200 text-[#000066] hover:bg-yellow-400 hover:text-[#000066] hover:scale-105'
                                    }`}
                                onClick={() => setMode('pendinggrade')}
                                type="button"
                            >
                                โปรเจคที่ยังไม่ส่งเกรด
                            </button>
                            <button
                                className={`px-3 py-2 rounded-3xl text-xs transition-all duration-200
                  ${mode === 'pending'
                                        ? 'bg-[#000066] text-white shadow-lg'
                                        : 'bg-gray-200 text-[#000066] hover:bg-yellow-400 hover:text-[#000066] hover:scale-105'
                                    }`}
                                onClick={() => setMode('pending')}
                                type="button"
                            >
                                โปรเจคที่รอกรอกสถานะ
                            </button>
                        </div>
                        {!isEditMode && (
                            <button
                                className='underline text-[#000066] hover:text-yellow-500 bg-transparent font-semibold text-xs shadow-none border-none transition-all duration-200'
                                onClick={handleEditMode}
                            >
                                แก้ไขข้อมูล
                            </button>
                        )}
                        {isEditMode && (
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="underline text-green-600 bg-transparent hover:text-yellow-500 font-semibold text-xs shadow-none border-none px-2 hover:bg-gray-200 hover:py-1 hover:rounded-xl transition-all duration-200"
                                    onClick={handleSaveAll}
                                >
                                    บันทึก
                                </button>
                                <button
                                    className="underline text-red-600 bg-transparent hover:text-yellow-500 hover:bg-gray-200 hover:py-1 hover:rounded-xl font-semibold text-xs shadow-none border-none px-2 transition-all duration-200"
                                    onClick={handleCancelEdit}
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="table-auto w-full min-w-[1200px] bg-white border border-gray-300 mx-auto">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="w-[40px] px-2 py-1 border text-xs text-center">ลำดับ</th>
                                    <th className="w-[180px] px-4 py-2 border text-xs text-center">ชื่อโปรเจค</th>
                                    <th className="w-[120px] px-4 py-2 border text-xs text-center">ชื่อนักศึกษา</th>
                                    <th className="w-[80px] px-4 py-2 border text-xs text-center">รหัสนักศึกษา</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">ผลสอบEng</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">ทดลอง 30 วัน</th>
                                    <th className="w-[80px] px-1 py-1 border text-xs text-center">เอกสารขอสอบ</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">ปีที่สอบ</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">ผ่าน/ไม่ผ่าน</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">เกรด(โปรเจค2)</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">ส่งเกรด นศ.1</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">ส่งเกรด นศ.2</th>
                                    <th className="w-[80px] px-1 py-1 border text-xs text-center">หมายเหตุ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayProjects.length === 0 ? (
                                    <tr>
                                        <td colSpan={13} className="text-center py-6 text-gray-500 text-sm">ไม่มีข้อมูล</td>
                                    </tr>
                                ) : (
                                    filteredProjects.map((p, idx) => {
                                        // ประกาศ gradeObj ใน scope นี้
                                        let gradeObj = { grade1: '', grade2: '' };
                                        try {
                                            if (editState[p.pj2_ID]?.gradePj2) {
                                                gradeObj = JSON.parse(editState[p.pj2_ID].gradePj2);
                                            } else if (p.gradePj2) {
                                                gradeObj = JSON.parse(p.gradePj2);
                                            }
                                        } catch {
                                            gradeObj = { grade1: '', grade2: '' };
                                        }
                                        console.log('passStatus2:', p.passStatus2);
                                        return (
                                            <tr key={p.pj2_ID} className="bg-white">
                                                <td className="px-2 py-1 border text-xs text-center">{idx + 1}</td>
                                                {/* ชื่อโปรเจค */}
                                                <td className="px-4 py-2 border text-xs text-left break-words whitespace-normal max-w-[180px] overflow-hidden">
                                                    {isEditMode ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                className="w-full max-w-[160px] text-xs border-0 border-b border-gray-400 bg-transparent truncate"
                                                                value={editState[p.pj2_ID]?.p_nameTH ?? p.p_nameTH ?? ''}
                                                                onChange={handleEditChange(p.pj2_ID, 'p_nameTH')}
                                                                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                            />
                                                            <br />
                                                            <input
                                                                type="text"
                                                                className="w-full max-w-[160px] text-xs border-0 border-b border-gray-400 bg-transparent truncate"
                                                                value={editState[p.pj2_ID]?.p_nameEN ?? p.p_nameEN ?? ''}
                                                                onChange={handleEditChange(p.pj2_ID, 'p_nameEN')}
                                                                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {p.p_nameTH || '-'}
                                                            {p.p_nameEN ? <><br />{p.p_nameEN}</> : null}
                                                        </>
                                                    )}
                                                </td>
                                                {/* ชื่อนักศึกษา */}
                                                <td className="px-4 py-2 border text-xs text-left break-words whitespace-normal max-w-[120px] overflow-hidden">
                                                    {isEditMode ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                className="w-full max-w-[110px] text-xs border-0 border-b border-gray-400 bg-transparent truncate"
                                                                value={editState[p.pj2_ID]?.s_name1 ?? p.s_name1 ?? ''}
                                                                onChange={handleEditChange(p.pj2_ID, 's_name1')}
                                                                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                            />
                                                            <br />
                                                            <input
                                                                type="text"
                                                                className="w-full max-w-[110px] text-xs border-0 border-b border-gray-400 bg-transparent truncate"
                                                                value={editState[p.pj2_ID]?.s_name2 ?? p.s_name2 ?? ''}
                                                                onChange={handleEditChange(p.pj2_ID, 's_name2')}
                                                                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {p.s_name1}
                                                            {p.s_name2 ? <><br />{p.s_name2}</> : null}
                                                        </>
                                                    )}
                                                </td>
                                                {/* รหัสนักศึกษา */}
                                                <td className="px-4 py-2 border text-xs text-center max-w-[90px] overflow-hidden">
                                                    {isEditMode ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                className="w-full max-w-[80px] text-xs border-0 border-b border-gray-400 bg-transparent text-center truncate"
                                                                value={editState[p.pj2_ID]?.s_code1 ?? p.s_code1 ?? ''}
                                                                onChange={handleEditChange(p.pj2_ID, 's_code1')}
                                                                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                            />
                                                            <br />
                                                            <input
                                                                type="text"
                                                                className="w-full max-w-[80px] text-xs border-0 border-b border-gray-400 bg-transparent text-center truncate"
                                                                value={editState[p.pj2_ID]?.s_code2 ?? p.s_code2 ?? ''}
                                                                onChange={handleEditChange(p.pj2_ID, 's_code2')}
                                                                style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {p.s_code1}
                                                            {p.s_code2 ? <><br />{p.s_code2}</> : null}
                                                        </>
                                                    )}
                                                </td>
                                                {/* ผลสอบEng */}
                                                <td className="px-1 py-1 border text-xs text-center max-w-[60px] overflow-hidden">
                                                    {isEditMode ? (
                                                        <>
                                                            <input
                                                                type="checkbox"
                                                                checked={!!editState[p.pj2_ID]?.engS1}
                                                                onChange={handleEditChange(p.pj2_ID, 'engS1')}
                                                            />
                                                            <br />
                                                            <input
                                                                type="checkbox"
                                                                checked={!!editState[p.pj2_ID]?.engS2}
                                                                onChange={handleEditChange(p.pj2_ID, 'engS2')}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {p.engS1 === 1 ? '✔' : '-'}
                                                            <br />
                                                            {p.engS2 === 1 ? '✔' : '-'}
                                                        </>
                                                    )}
                                                </td>
                                                {/* ทดลอง 30 วัน */}
                                                <td className="px-1 py-1 border text-xs text-center max-w-[60px] overflow-hidden">
                                                    {isEditMode ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={!!editState[p.pj2_ID]?.test30}
                                                            onChange={handleEditChange(p.pj2_ID, 'test30')}
                                                        />
                                                    ) : (
                                                        p.test30 === 1 ? '✔' : '-'
                                                    )}
                                                </td>
                                                {/* เอกสารขอสอบ */}
                                                <td className="px-1 py-1 border text-xs text-center max-w-[80px] overflow-hidden">
                                                    {isEditMode ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={!!editState[p.pj2_ID]?.docStatus2}
                                                            onChange={handleEditChange(p.pj2_ID, 'docStatus2')}
                                                        />
                                                    ) : (
                                                        p.docStatus2 === 1 ? '✔' : '-'
                                                    )}
                                                </td>
                                                {/* ปีที่สอบ */}
                                                <td className="px-1 py-1 border text-xs text-center max-w-[60px] overflow-hidden">
                                                    {isEditMode ? (
                                                        <input
                                                            type="text"
                                                            className="w-16 max-w-[56px] text-xs border-0 border-b border-gray-400 bg-transparent text-center truncate"
                                                            value={editState[p.pj2_ID]?.yearPj2 ?? p.yearPj2 ?? ''}
                                                            onChange={handleEditChange(p.pj2_ID, 'yearPj2')}
                                                            style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                        />
                                                    ) : (
                                                        p.yearPj2 || '-'
                                                    )}
                                                </td>
                                                {/* ผ่าน/ไม่ผ่าน */}
                                                <td className="px-1 py-1 border text-xs text-center max-w-[60px] overflow-hidden">
                                                    {isEditMode ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={!!editState[p.pj2_ID]?.passStatus2}
                                                            onChange={handleEditChange(p.pj2_ID, 'passStatus2')}
                                                        />
                                                    ) : (
                                                        p.passStatus2 === 1 ? '✔' : '-'
                                                    )}
                                                </td>
                                                {/* เกรด(โปรเจค2) */}
                                                <td className="px-1 py-1 border text-xs text-center max-w-[60px] overflow-hidden">
                                                    {isEditMode ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                className="w-16 max-w-[56px] text-xs border-0 border-b border-gray-400 bg-transparent text-center truncate"
                                                                value={gradeObj.grade1}
                                                                onChange={e => {
                                                                    const newGrade = { ...gradeObj, grade1: e.target.value };
                                                                    setEditState(prev => ({
                                                                        ...prev,
                                                                        [p.pj2_ID]: {
                                                                            ...prev[p.pj2_ID],
                                                                            gradePj2: JSON.stringify(newGrade)
                                                                        }
                                                                    }));
                                                                }}
                                                            />
                                                            <br />
                                                            <input
                                                                type="text"
                                                                className="w-16 max-w-[56px] text-xs border-0 border-b border-gray-400 bg-transparent text-center truncate"
                                                                value={gradeObj.grade2}
                                                                onChange={e => {
                                                                    const newGrade = { ...gradeObj, grade2: e.target.value };
                                                                    setEditState(prev => ({
                                                                        ...prev,
                                                                        [p.pj2_ID]: {
                                                                            ...prev[p.pj2_ID],
                                                                            gradePj2: JSON.stringify(newGrade)
                                                                        }
                                                                    }));
                                                                }}
                                                            />
                                                        </>
                                                    ) : (
                                                        (() => {
                                                            try {
                                                                const g = JSON.parse(p.gradePj2 || '{}');
                                                                return (
                                                                    <>
                                                                        {g.grade1 || '-'}
                                                                        <br />
                                                                        {g.grade2 || '-'}
                                                                    </>
                                                                );
                                                            } catch {
                                                                return p.gradePj2 || '-';
                                                            }
                                                        })()
                                                    )}
                                                </td>
                                                {/* ส่งเกรด นศ.1 */}
                                                <td className="px-1 py-1 border text-xs text-center max-w-[60px] overflow-hidden">
                                                    {isEditMode ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={!!editState[p.pj2_ID]?.gradeSend1}
                                                            onChange={handleEditChange(p.pj2_ID, 'gradeSend1')}
                                                        />
                                                    ) : (
                                                        p.gradeSend1 === 1 ? '✔' : '-'
                                                    )}
                                                </td>
                                                <td className="px-1 py-1 border text-xs text-center max-w-[60px] overflow-hidden">
                                                    {isEditMode ? (
                                                        <input
                                                            type="checkbox"
                                                            checked={!!editState[p.pj2_ID]?.gradeSend2}
                                                            onChange={handleEditChange(p.pj2_ID, 'gradeSend2')}
                                                        />
                                                    ) : (
                                                        p.gradeSend2 === 1 ? '✔' : '-'
                                                    )}
                                                </td>
                                                {/* หมายเหตุ */}
                                                <td className="px-1 py-1 border text-xs text-center max-w-[80px] overflow-hidden">
                                                    {isEditMode ? (
                                                        <input
                                                            type="text"
                                                            className="w-24 max-w-[76px] text-xs border-0 border-b border-gray-400 bg-transparent text-center truncate"
                                                            value={editState[p.pj2_ID]?.note ?? p.note ?? ''}
                                                            onChange={handleEditChange(p.pj2_ID, 'note')}
                                                            style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                        />
                                                    ) : (
                                                        p.note || '-'
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div >
    );
}

export default Project2;