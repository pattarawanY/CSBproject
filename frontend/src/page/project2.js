import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/navbar';

function Project2() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [project2Data, setProject2Data] = useState({});
    const [mode, setMode] = useState('all');
    const [checkboxState, setCheckboxState] = useState({});
    const [isEditMode, setIsEditMode] = useState(false);
    const [gradeState, setGradeState] = useState({});
    const [remarkState, setRemarkState] = useState({});
    const [yearState, setYearState] = useState({});
    const [editState, setEditState] = useState({});
    const [passState, setPassState] = useState({});
    const [search, setSearch] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const handleEditMode = () => {
        const newEditState = {};
        filteredProjects.forEach(p => {
            newEditState[p.pj2_ID] = {
                yearPj2: p.yearPj2,
                gradePj2: p.gradePj2,
                engS1: !!p.engS1,
                engS2: !!p.engS2,
                test30: !!p.test30,
                docStatus2: !!p.docStatus2,
                passStatus2: !!p.passStatus2,
                gradeSend1: !!p.gradeSend1,
                gradeSend2: !!p.gradeSend2,
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
        if (Object.keys(project2Data).length > 0) {
            const initial = {};
            projects.forEach(p => {
                const pj2 = project2Data[p.p_ID];
                initial[p.p_ID] = pj2 ? pj2.yearPj2 || '' : '';
            });
            setYearState(initial);
        }
    }, [project2Data, projects]);

    useEffect(() => {
        if (Object.keys(project2Data).length > 0) {
            const initial = {};
            projects.forEach(p => {
                const pj2 = project2Data[p.p_ID];
                initial[p.p_ID] = pj2 ? pj2.note || '' : '';
            });
            setRemarkState(initial);
        }
    }, [project2Data, projects]);

    useEffect(() => {
        if (Object.keys(project2Data).length > 0) {
            const initial = {};
            projects.forEach(p => {
                const pj2 = project2Data[p.p_ID];
                initial[p.p_ID] = {
                    engS1: pj2 ? String(pj2.engS1 ?? '0') === '1' : false,
                    engS2: pj2 ? String(pj2.engS2 ?? '0') === '1' : false,
                    test30: pj2 ? String(pj2.test30 ?? '0') === '1' : false,
                    passStatus2: pj2 ? String(pj2.passStatus2 ?? '0') === '1' : false,
                    docStatus2: pj2 ? String(pj2.docStatus2 ?? '0') === '1' : false,
                    gradeSend1: pj2 ? String(pj2.gradeSend1 ?? '0') === '1' : false,
                    gradeSend2: pj2 ? String(pj2.gradeSend2 ?? '0') === '1' : false,
                };
            });
            setCheckboxState(initial);
        }
    }, [project2Data, projects]);

    useEffect(() => {
        if (Object.keys(project2Data).length > 0) {
            const initial = {};
            projects.forEach(p => {
                const pj2 = project2Data[p.p_ID];
                initial[p.p_ID] = pj2 ? pj2.gradePj2 || '' : '';
            });
            setGradeState(initial);
        }
    }, [project2Data, projects]);

    useEffect(() => {
        if (Object.keys(project2Data).length > 0) {
            const initial = {};
            projects.forEach(p => {
                const pj2 = project2Data[p.p_ID];
                initial[p.p_ID] = pj2 ? String(pj2.passStatus2 ?? '0') === '1' : false;
            });
            setPassState(initial);
        }
    }, [project2Data, projects]);

    const isFilled = v => v !== null && v !== undefined && !(typeof v === 'string' && v.trim() === '') && v !== '-';

    const isGradeFilled = grade => {
        try {
            const g = JSON.parse(grade || '{}');
            return isFilled(g.grade1) && isFilled(g.grade2);
        } catch {
            return false;
        }
    };

    const isFailGrade = grade => {
        try {
            const g = JSON.parse(grade || '{}');
            const failSet = ['F', 'FE', 'IP'];
            return failSet.includes((g.grade1 || '').toUpperCase()) || failSet.includes((g.grade2 || '').toUpperCase());
        } catch {
            return false;
        }
    };

    const isPassStatusTrue = v => v === 1 || v === '1' || v === true;
    const isPassStatusFalse = v => v === 0 || v === '0' || v === false;

    const filteredProjects = projects
        .filter(p => {
            // filter ด้วยคำค้นหา
            if (!search.trim()) return true;
            const keyword = search.trim().toLowerCase();
            return (
                (p.p_nameTH && p.p_nameTH.toLowerCase().includes(keyword)) ||
                (p.p_nameEN && p.p_nameEN.toLowerCase().includes(keyword)) ||
                (p.s_name1 && p.s_name1.toLowerCase().includes(keyword)) ||
                (p.s_name2 && p.s_name2.toLowerCase().includes(keyword)) ||
                (p.s_code1 && p.s_code1.toLowerCase().includes(keyword)) ||
                (p.s_code2 && p.s_code2.toLowerCase().includes(keyword))
            );
        })
        .filter(p => {
            // filter ด้วยปีการศึกษาจาก yearPj2
            if (selectedSemester && selectedSemester.trim()) {
                return String(p.yearPj2).trim().toLowerCase() === String(selectedSemester).trim().toLowerCase();
            }
            return true;
        })
        .filter(p => {
            // filter mode เดิม
            if (mode === 'all') return true;

            // สถานะ fail: สนใจแค่ passStatus2 กับเกรด
            if (mode === 'fail') {
                return isFailGrade(p.gradePj2);
            }

            // สถานะ pass: เงื่อนไขเดิม
            if (mode === 'pass') {
                return (
                    isFilled(p.yearPj2) &&
                    isGradeFilled(p.gradePj2) &&
                    !isFailGrade(p.gradePj2) &&
                    p.engS1 === 1 && p.engS2 === 1 &&
                    isFilled(p.test30) &&
                    isPassStatusTrue(p.passStatus2) &&
                    p.docStatus2 === 1 &&
                    p.gradeSend1 === 1 && p.gradeSend2 === 1
                );
            }

            // สถานะ pending: ต้องมีชื่อโปรเจค ชื่อนักศึกษา รหัสนักศึกษา และช่องอื่นๆ ว่าง
            if (mode === 'pending') {
                // เฉพาะช่องที่ต้องเช็ค
                const isEmptyOrDash = v =>
                    v === null || v === undefined || (typeof v === 'string' && v.trim() === '') || v === '-';

                // ผลสอบ Eng
                const engS1Empty = isEmptyOrDash(p.engS1) || p.engS1 === 0;
                const engS2Empty = isEmptyOrDash(p.engS2) || p.engS2 === 0;

                // ทดลอง 30 วัน
                const test30Empty = isEmptyOrDash(p.test30) || p.test30 === 0;

                // เอกสารขอสอบ
                const docStatus2Empty = isEmptyOrDash(p.docStatus2) || p.docStatus2 === 0;

                // ปีที่สอบ
                const yearPj2Empty = isEmptyOrDash(p.yearPj2);

                // ผ่าน/ไม่ผ่าน
                const passStatus2Empty = isEmptyOrDash(p.passStatus2) || p.passStatus2 === 0;

                // เกรดโปรเจค2
                let gradeEmpty = true;
                try {
                    const g = JSON.parse(p.gradePj2 || '{}');
                    gradeEmpty = isEmptyOrDash(g.grade1) && isEmptyOrDash(g.grade2);
                } catch {
                    gradeEmpty = true;
                }

                // ส่งเกรด
                const gradeSend1Empty = isEmptyOrDash(p.gradeSend1) || p.gradeSend1 === 0;
                const gradeSend2Empty = isEmptyOrDash(p.gradeSend2) || p.gradeSend2 === 0;

                // ทุกช่องต้องว่างหรือเป็น '-'
                return (
                    engS1Empty &&
                    engS2Empty &&
                    test30Empty &&
                    docStatus2Empty &&
                    yearPj2Empty &&
                    passStatus2Empty &&
                    gradeEmpty &&
                    gradeSend1Empty &&
                    gradeSend2Empty
                );
            }

            // สถานะ pendinggrade: มีข้อมูลครบ แต่ยังไม่ส่งเกรด
            if (mode === 'pendinggrade') {
                // ฟังก์ชันเช็คว่ามีข้อมูล (ไม่ใช่ null, undefined, '', '-')
                const isFilledOrTrue = v =>
                    v !== null && v !== undefined && !(typeof v === 'string' && v.trim() === '') && v !== '-' && v !== 0;

                // ผลสอบ Eng
                const engS1Filled = isFilledOrTrue(p.engS1) && p.engS1 === 1;
                const engS2Filled = isFilledOrTrue(p.engS2) && p.engS2 === 1;

                // ทดลอง 30 วัน
                const test30Filled = isFilledOrTrue(p.test30) && p.test30 === 1;

                // เอกสารขอสอบ
                const docStatus2Filled = isFilledOrTrue(p.docStatus2) && p.docStatus2 === 1;

                // ปีที่สอบ
                const yearPj2Filled = isFilledOrTrue(p.yearPj2);

                // ผ่าน/ไม่ผ่าน
                const passStatus2Filled = isFilledOrTrue(p.passStatus2) && p.passStatus2 === 1;

                // เกรดโปรเจค2
                let gradeFilled = false;
                try {
                    const g = JSON.parse(p.gradePj2 || '{}');
                    gradeFilled = isFilledOrTrue(g.grade1) && isFilledOrTrue(g.grade2);
                } catch {
                    gradeFilled = false;
                }

                // ส่งเกรด ต้องไม่มีข้อมูลหรือเป็น '-'
                const gradeSend1Empty = !isFilledOrTrue(p.gradeSend1) || p.gradeSend1 === 0;
                const gradeSend2Empty = !isFilledOrTrue(p.gradeSend2) || p.gradeSend2 === 0;

                return (
                    engS1Filled &&
                    engS2Filled &&
                    test30Filled &&
                    docStatus2Filled &&
                    yearPj2Filled &&
                    passStatus2Filled &&
                    gradeFilled &&
                    gradeSend1Empty &&
                    gradeSend2Empty
                );
            }

            if (mode === 'noTest') {
                // ฟังก์ชันเช็คว่าไม่มีข้อมูล (null, undefined, '', '-')
                const isEmptyOrDash = v =>
                    v === null || v === undefined || (typeof v === 'string' && v.trim() === '') || v === '-' || v === 0;

                // ทดลอง 30 วัน
                const test30Empty = isEmptyOrDash(p.test30);

                // เกรดโปรเจค2
                let gradeEmpty = true;
                try {
                    const g = JSON.parse(p.gradePj2 || '{}');
                    gradeEmpty = isEmptyOrDash(g.grade1) && isEmptyOrDash(g.grade2);
                } catch {
                    gradeEmpty = true;
                }

                // ส่งเกรด
                const gradeSend1Empty = isEmptyOrDash(p.gradeSend1);
                const gradeSend2Empty = isEmptyOrDash(p.gradeSend2);

                return (
                    test30Empty &&
                    gradeEmpty &&
                    gradeSend1Empty &&
                    gradeSend2Empty
                );
            }

            // สถานะ eng: สนใจแค่ผลสอบ Eng
            if (mode === 'eng') {
                // ถ้าไม่มีข้อมูลทั้งสองช่อง ให้เข้าเงื่อนไขนี้ด้วย
                if ((p.engS1 === null || p.engS1 === undefined) && (p.engS2 === null || p.engS2 === undefined)) return true;
                const isEng1Passed = p.engS1 === 1;
                const isEng2Passed = p.engS2 === 1;
                return (isEng1Passed !== isEng2Passed);
            }

            return true;
        });

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
                        yearPass2: editState[p.pj2_ID]?.yearPass2 ?? p.yearPass2,
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

    return (
        <div className="flex flex-col h-screen">
            <Navbar
                search={search}
                setSearch={setSearch}
                selectedSemester={selectedSemester}
                setSelectedSemester={setSelectedSemester}
            />
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
                                    <th className="w-[140px] px-4 py-2 border text-xs text-center">ชื่อนักศึกษา</th>
                                    <th className="w-[80px] px-4 py-2 border text-xs text-center">รหัสนักศึกษา</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">ผลสอบEng</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">ทดลอง 30 วัน</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">เอกสารขอสอบ</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">ปีที่สอบ</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">ผ่าน/ไม่ผ่าน</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">เกรด(โปรเจค2)</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">ส่งเกรด</th>
                                    <th className="w-[60px] px-1 py-1 border text-xs text-center">ปีที่ผ่าน</th>
                                    <th className="w-[40px] px-1 py-1 border text-xs text-center">หมายเหตุ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.length === 0 ? (
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
                                                <td className="px-1 py-1 border text-xs text-center w-[60px] max-w-[60px] overflow-hidden">
                                                    {isEditMode ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                className="w-full max-w-[56px] text-xs border-0 border-b border-gray-400 bg-transparent text-center truncate"
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
                                                                placeholder="เกรด1"
                                                            />
                                                            <br />
                                                            <input
                                                                type="text"
                                                                className="w-full max-w-[56px] text-xs border-0 border-b border-gray-400 bg-transparent text-center truncate"
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
                                                                placeholder="เกรด2"
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {gradeObj.grade1 || '-'}
                                                            <br />
                                                            {gradeObj.grade2 || '-'}
                                                        </>
                                                    )}
                                                </td>
                                                <td className="px-1 py-1 border text-xs text-center w-[60px] max-w-[60px] overflow-hidden">
                                                    {isEditMode ? (
                                                        <>
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 align-middle"
                                                                checked={!!editState[p.pj2_ID]?.gradeSend1}
                                                                onChange={handleEditChange(p.pj2_ID, 'gradeSend1')}
                                                            />
                                                            <br />
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 align-middle"
                                                                checked={!!editState[p.pj2_ID]?.gradeSend2}
                                                                onChange={handleEditChange(p.pj2_ID, 'gradeSend2')}
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            {p.gradeSend1 === 1 ? '✔' : '-'}
                                                            <br />
                                                            {p.gradeSend2 === 1 ? '✔' : '-'}
                                                        </>
                                                    )}
                                                </td>
                                                {/* ปีที่ผ่าน */}
                                                <td className="w-[60px] px-1 py-1 border text-xs text-center">
                                                    {isEditMode ? (
                                                        <input
                                                            type="text"
                                                            className="w-16 max-w-[56px] text-xs border-0 border-b border-gray-400 bg-transparent text-center truncate"
                                                            value={editState[p.pj2_ID]?.yearPass2 ?? p.yearPass2 ?? ''}
                                                            onChange={handleEditChange(p.pj2_ID, 'yearPass2')}
                                                            maxLength={10}
                                                        />
                                                    ) : (
                                                        (p.passStatus2 === 1 ? (p.yearPass2 || '-') : '-')
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