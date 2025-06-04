// แสดงเจคที่อยู่ในขั้นโปรเจค1 ให้แยกเป็นอันที่ผ่านกับยังไม่ผ่าน
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/navbar';

function Project1() {
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

    const handleEditMode = () => setIsEditMode(true);
    const handleCancelEdit = () => setIsEditMode(false);

    useEffect(() => {
        const fetchProject1WithProject = async () => {
            try {
                const res = await axios.get('http://localhost:8000/project1/');
                setProject1Data(res.data); // res.data เป็น array
                setProjects(res.data);     // <--- เพิ่มบรรทัดนี้
            } catch (error) {
                console.error('Error fetching project1 with project data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject1WithProject();
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

    const handleYearChange = (p_ID) => (e) => {
        setYearState(prev => ({
            ...prev,
            [p_ID]: e.target.value
        }));
    };

    const filteredProjects = mode === 'all'
        ? projects
        : projects.filter(p => {
            const pj1 = project1Data[p.p_ID];

            if (mode === 'pending') {
                return (
                    !pj1 ||
                    (
                        (pj1.mentorStatus === null || pj1.mentorStatus === undefined) &&
                        (pj1.docStatus === null || pj1.docStatus === undefined) &&
                        (!pj1.gradePj1 || pj1.gradePj1 === '')
                    )
                );
            }

            if (!pj1) return false;

            const isMentor = String(pj1.mentorStatus ?? '0') === '1';
            const isDoc = String(pj1.docStatus ?? '0') === '1';
            const hasGrade = pj1.gradePj1 && pj1.gradePj1 !== '';

            if (mode === 'notyet') {
                const filledCount = [isMentor, isDoc, hasGrade].filter(Boolean).length;
                return filledCount > 0 && filledCount < 3;
            }

            if (mode === 'pendinggrade') {
                return isMentor && isDoc && (!pj1.gradePj1 || pj1.gradePj1 === '');
            }

            const isPass = isMentor && isDoc && hasGrade && pj1.gradePj1 !== 'F';
            const isFail = isMentor && isDoc && hasGrade && pj1.gradePj1 === 'F';

            if (mode === 'pass') return isPass;
            if (mode === 'fail') return isFail;

            return !(isPass || isFail || (isMentor && isDoc && !hasGrade) || ([isMentor, isDoc, hasGrade].filter(Boolean).length > 0 && [isMentor, isDoc, hasGrade].filter(Boolean).length < 3));
        });

    // const handleEdit = (index, p) => {
    //     setEditIndex(index);
    //     setFormData({
    //         mentorStatus: false,
    //         docStatus: false,
    //         p_ID: p.p_ID
    //     });
    // };

    const handleCheckboxChange = (p_ID, field) => (e) => {
        setCheckboxState(prev => ({
            ...prev,
            [p_ID]: {
                ...prev[p_ID],
                [field]: e.target.checked
            }
        }));
    };

    const handleGradeChange = (p_ID) => (e) => {
        setGradeState(prev => ({
            ...prev,
            [p_ID]: e.target.value
        }));
    };

    const handleRemarkChange = (p_ID) => (e) => {
        setRemarkState(prev => ({
            ...prev,
            [p_ID]: e.target.value
        }));
    };

    const handleEditChange = (p_ID, field) => (e) => {
        setEditState(prev => ({
            ...prev,
            [p_ID]: {
                ...prev[p_ID],
                [field]: e.target.value
            }
        }));
    };

    // const handleCancel = () => {
    //     setEditIndex(null);
    //     setFormData({});
    // };

    // const handleSave = async (index) => {
    //     const data = {
    //         p_ID: formData.p_ID,
    //         mentorStatus: formData.mentorStatus ? 1 : 0,
    //         docStatus: formData.docStatus ? 1 : 0,
    //         gradePj1: '', // ยังไม่กรอกเกรด
    //         yearPj1: '',  // ยังไม่กรอกปี
    //         createdDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
    //         modifiedDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
    //     };
    //     try {
    //         await axios.post('http://localhost:8000/project1/create', data);
    //         alert('บันทึกข้อมูลสำเร็จ');
    //         setEditIndex(null);
    //         setFormData({});
    //         window.location.reload();
    //     } catch (error) {
    //         alert('เกิดข้อผิดพลาด');
    //         console.error(error);
    //     }
    // };

    const handleSaveAll = async () => {
        try {
            for (const p of filteredProjects) {
                // 1. ถ้ามีการแก้ไขข้อมูล project
                if (
                    p.p_nameEN !== editState[p.p_ID]?.p_nameEN ||
                    p.p_nameTH !== editState[p.p_ID]?.p_nameTH ||
                    p.s_name1 !== editState[p.p_ID]?.s_name1 ||
                    p.s_name2 !== editState[p.p_ID]?.s_name2 ||
                    p.s_code1 !== editState[p.p_ID]?.s_code1 ||
                    p.s_code2 !== editState[p.p_ID]?.s_code2
                ) {
                    await axios.put(`http://localhost:8000/project/update/${p.p_ID}`, {
                        p_nameEN: editState[p.p_ID]?.p_nameEN ?? p.p_nameEN,
                        p_nameTH: editState[p.p_ID]?.p_nameTH ?? p.p_nameTH,
                        s_name1: editState[p.p_ID]?.s_name1 ?? p.s_name1,
                        s_name2: editState[p.p_ID]?.s_name2 ?? p.s_name2,
                        s_code1: editState[p.p_ID]?.s_code1 ?? p.s_code1,
                        s_code2: editState[p.p_ID]?.s_code2 ?? p.s_code2,
                        modifiedDate: new Date().toISOString().slice(0, 19).replace('T', ' ')
                    });
                }

                // 2. ถ้ามีการแก้ไขข้อมูล project1
                if (
                    checkboxState[p.p_ID]?.mentorStatus !== p.mentorStatus ||
                    checkboxState[p.p_ID]?.docStatus !== p.docStatus ||
                    gradeState[p.p_ID] !== p.gradePj1 ||
                    yearState[p.p_ID] !== p.yearPj1 ||
                    remarkState[p.p_ID] !== p.note
                ) {
                    await axios.put(`http://localhost:8000/project1/update/${p.pj1_ID}`, {
                        mentorStatus: checkboxState[p.p_ID]?.mentorStatus ? 1 : 0,
                        docStatus: checkboxState[p.p_ID]?.docStatus ? 1 : 0,
                        gradePj1: gradeState[p.p_ID] || '',
                        yearPj1: yearState[p.p_ID] || '',
                        modifiedDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
                        note: remarkState[p.p_ID] || ''
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
            <Navbar />
            <div className="flex-1 mt-10 flex flex-col items-left justify-start bg-gray-100 p-8">
                <div className="flex items-center gap-4 w-full">
                    <h2 className="text-lg font-semibold mb-2">การสอบก้าวหน้า</h2>
                    <div className="flex justify-between gap-2 flex-wrap flex-1 mt-2">
                        <div className="flex gap-2 mb-4 flex-wrap">
                            <button
                                className={`px-3 py-2 rounded-3xl text-xs ${mode === 'all' ? 'bg-[#000066] text-white shadow-lg' : 'bg-gray-200 text-[#000066]'}`}
                                onClick={() => setMode('all')}
                            >
                                แสดงทั้งหมด
                            </button>
                            <button
                                className={`px-3 py-2 rounded-3xl text-xs ${mode === 'pass' ? 'bg-[#000066] text-white shadow-lg' : 'bg-gray-200 text-[#000066]'}`}
                                onClick={() => setMode('pass')}
                            >
                                โปรเจคที่สอบก้าวหน้าผ่านแล้ว
                            </button>
                            <button
                                className={`px-3 py-2 rounded-3xl text-xs ${mode === 'fail' ? 'bg-[#000066] text-white shadow-lg' : 'bg-gray-200 text-[#000066]'}`}
                                onClick={() => setMode('fail')}
                            >
                                โปรเจคที่สอบก้าวหน้าไม่ผ่าน
                            </button>
                            <button
                                className={`px-3 py-2 rounded-3xl text-xs ${mode === 'notyet' ? 'bg-[#000066] text-white shadow-lg' : 'bg-gray-200 text-[#000066]'}`}
                                onClick={() => setMode('notyet')}
                            >
                                โปรเจคที่เอกสารไม่ครบ
                            </button>
                            <button
                                className={`px-3 py-2 rounded-3xl text-xs ${mode === 'pendinggrade' ? 'bg-[#000066] text-white shadow-lg' : 'bg-gray-200 text-[#000066]'}`}
                                onClick={() => setMode('pendinggrade')}
                            >
                                โปรเจคที่ยังไม่มีเกรด
                            </button>
                            <button
                                className={`px-3 py-2 rounded-3xl text-xs ${mode === 'pending' ? 'bg-[#000066] text-white shadow-lg' : 'bg-gray-200 text-[#000066]'}`}
                                onClick={() => setMode('pending')}
                            >
                                โปรเจคที่รอกรอกสถานะ
                            </button>
                        </div>
                        {!isEditMode && (
                            <button
                                className='underline text-[#000066] hover:text-yellow-500 bg-transparent font-semibold text-xs shadow-none border-none'
                                onClick={handleEditMode}
                            >
                                แก้ไขข้อมูล
                            </button>
                        )}
                        {isEditMode && (
                            <div className="flex gap-2 mt-2">
                                <button
                                    className="underline text-green-600 bg-transparent hover:text-yellow-500 font-semibold text-xs shadow-none border-none px-2 hover:bg-gray-200 hover:py-1 hover:rounded-xl"
                                    onClick={handleSaveAll}
                                >
                                    บันทึก
                                </button>
                                <button
                                    className="underline text-red-600 bg-transparent hover:text-yellow-500 hover:bg-gray-200 hover:py-1 hover:rounded-xl font-semibold text-xs shadow-none border-none px-2"
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
                        <table className="table-fixed w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200 text-gray-700">
                                    <th className="w-[12px] px-2 py-1 border text-xs text-center whitespace-normal">ลำดับ</th>
                                    <th className="w-[120px] px-4 py-2 border text-xs text-center break-words whitespace-normal">ชื่อโปรเจค</th>
                                    <th className="w-[80px] px-4 py-2 border text-xs text-center break-words whitespace-normal">ชื่อนักศึกษา</th>
                                    <th className="w-[42px] px-4 py-2 border text-xs break-words">รหัสนักศึกษา</th>
                                    <th className="w-[32px] px-1 py-1 border text-xs text-center break-words">แต่งตั้งที่ปรึกษา</th>
                                    <th className="w-[32px] px-1 py-1 border text-xs text-center break-words">เอกสารขอสอบ</th>
                                    <th className="w-[24px] px-1 py-1 border text-xs text-center break-words">เกรด</th>
                                    <th className="w-[24px] px-1 py-1 border text-xs text-center break-words">ปีการศึกษา</th>
                                    <th className="w-[36px] px-1 py-1 border text-xs text-center break-words">หมายเหตุ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-6 text-gray-500 text-sm">
                                            ไม่มีข้อมูล
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProjects.map((p, index) => (
                                        <tr key={`main-${p.p_ID}`} className="bg-white">
                                            <td className="px-4 py-2 border text-xs text-center">{index + 1}</td>
                                            <td className="w-[120px] px-4 py-2 border text-xs text-left break-words whitespace-normal">
                                                {isEditMode ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            className="w-full text-xs border-0 border-b border-gray-400 bg-transparent"
                                                            value={editState[p.p_ID]?.p_nameEN ?? p.p_nameEN}
                                                            onChange={handleEditChange(p.p_ID, 'p_nameEN')}
                                                        /><br />
                                                        <input
                                                            type="text"
                                                            className="w-full text-xs border-0 border-b border-gray-400 bg-transparent"
                                                            value={editState[p.p_ID]?.p_nameTH ?? p.p_nameTH}
                                                            onChange={handleEditChange(p.p_ID, 'p_nameTH')}
                                                        />
                                                    </>
                                                ) : (
                                                    <div className="break-words whitespace-normal text-black">
                                                        {p.p_nameEN}<br />
                                                        {p.p_nameTH}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="w-[80px] px-4 py-2 border text-xs text-left break-words whitespace-normal">
                                                {isEditMode ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            className="w-full text-xs border-0 border-b border-gray-400 bg-transparent"
                                                            value={editState[p.p_ID]?.s_name1 ?? p.s_name1}
                                                            onChange={handleEditChange(p.p_ID, 's_name1')}
                                                        /><br />
                                                        <input
                                                            type="text"
                                                            className="w-full text-xs border-0 border-b border-gray-400 bg-transparent"
                                                            value={editState[p.p_ID]?.s_name2 ?? p.s_name2}
                                                            onChange={handleEditChange(p.p_ID, 's_name2')}
                                                        />
                                                    </>
                                                ) : (
                                                    <div className="break-words whitespace-normal">
                                                        {p.s_name1}<br />
                                                        {p.s_name2}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 border text-xs">
                                                {isEditMode ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            className="w-full text-xs border-0 border-b border-gray-400 bg-transparent"
                                                            value={editState[p.p_ID]?.s_code1 ?? p.s_code1}
                                                            onChange={handleEditChange(p.p_ID, 's_code1')}
                                                        /><br />
                                                        <input
                                                            type="text"
                                                            className="w-full text-xs border-0 border-b border-gray-400 bg-transparent"
                                                            value={editState[p.p_ID]?.s_code2 ?? p.s_code2}
                                                            onChange={handleEditChange(p.p_ID, 's_code2')}
                                                        />
                                                    </>
                                                ) : (
                                                    <div>
                                                        <div>{p.s_code1}</div>
                                                        <div>{p.s_code2}</div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="w-[32px] px-1 py-1 border text-xs text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={checkboxState[p.p_ID]?.mentorStatus || false}
                                                    onChange={isEditMode ? handleCheckboxChange(p.p_ID, 'mentorStatus') : undefined}
                                                    disabled={!isEditMode}
                                                />
                                            </td>
                                            <td className="w-[32px] px-1 py-1 border text-xs text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={checkboxState[p.p_ID]?.docStatus || false}
                                                    onChange={isEditMode ? handleCheckboxChange(p.p_ID, 'docStatus') : undefined}
                                                    disabled={!isEditMode}
                                                />
                                            </td>
                                            <td className="w-[24px] px-1 py-1 border text-xs text-center">
                                                {isEditMode ? (
                                                    <input
                                                        type="text"
                                                        className="w-12 text-center border-0 border-b border-gray-400 rounded-none focus:ring-0 focus:border-blue-600 bg-transparent truncate"
                                                        value={gradeState[p.p_ID] || ''}
                                                        onChange={handleGradeChange(p.p_ID)}
                                                        maxLength={2}
                                                    />
                                                ) : (
                                                    p.gradePj1 || '-'
                                                )}
                                            </td>
                                            <td className="w-[36px] px-1 py-1 border text-xs text-center">
                                                {isEditMode ? (
                                                    <input
                                                        type="text"
                                                        className="w-20 text-xs border-0 border-b border-gray-400 rounded-none focus:ring-0 focus:border-blue-600 bg-transparent truncate"
                                                        value={yearState[p.p_ID] || ''}
                                                        onChange={handleYearChange(p.p_ID)}
                                                        maxLength={10}
                                                    />
                                                ) : (
                                                    p.yearPj1 || '-'
                                                )}
                                            </td>
                                            <td className="w-[36px] px-1 py-1 border text-xs text-center">
                                                {isEditMode ? (
                                                    <input
                                                        type="text"
                                                        className="w-20 text-xs border-0 border-b border-gray-400 rounded-none focus:ring-0 focus:border-blue-600 bg-transparent truncate"
                                                        value={remarkState[p.p_ID] || ''}
                                                        onChange={handleRemarkChange(p.p_ID)}
                                                        maxLength={30}
                                                    />
                                                ) : (
                                                    p.note || '-'
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div >
    );
}

export default Project1;