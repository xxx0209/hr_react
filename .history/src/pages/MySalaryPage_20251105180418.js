// import React, { useEffect, useState } from 'react';
// import axios from '../api/api';

// const MySalaryHistory = () => {
//   const [year, setYear] = useState(new Date().getFullYear().toString());
//   const [salaryList, setSalaryList] = useState([]);
//   const [selectedSalary, setSelectedSalary] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchSalaries();
//   }, [year]);

//   const fetchSalaries = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get('/api/salaries/completed/search', {
//         params: { year },
//         withCredentials: true
//       });
//       const sorted = res.data.sort((a, b) => new Date(b.payDate) - new Date(a.payDate));
//       setSalaryList(sorted);
//       setSelectedSalary(sorted[0] || null);
//     } catch (err) {
//       console.error('급여 내역 불러오기 실패:', err);
//       alert('급여 내역을 불러오지 못했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       {/* 왼쪽 4: 급여 목록 */}
//       <div style={styles.sidebar}>
//         <h3 style={styles.heading}>📅 연도별 급여</h3>
//         <select
//           value={year}
//           onChange={(e) => setYear(e.target.value)}
//           style={styles.select}
//         >
//           {[2023, 2024, 2025].map(y => (
//             <option key={y} value={y}>{y}년</option>
//           ))}
//         </select>

//         {loading ? (
//           <p>불러오는 중...</p>
//         ) : salaryList.length === 0 ? (
//           <p>해당 연도의 급여 내역이 없습니다.</p>
//         ) : (
//           <ul style={styles.list}>
//             {salaryList.map(s => (
//               <li
//                 key={s.salaryId}
//                 onClick={() => setSelectedSalary(s)}
//                 style={{
//                   ...styles.listItem,
//                   backgroundColor: selectedSalary?.salaryId === s.salaryId ? '#e6f0ff' : '#fff'
//                 }}
//               >
//                 <strong>{s.salaryMonth}</strong> - {Number(s.netPay).toLocaleString()} 원
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* 오른쪽 8: 급여 상세 */}
//       <div style={styles.detail}>
//         {selectedSalary ? (
//           <div>
//             <h2>{selectedSalary.salaryMonth} 급여 상세</h2>
//             <p><strong>지급일:</strong> {new Date(selectedSalary.payDate).toLocaleDateString()}</p>
//             <p><strong>기본급:</strong> {Number(selectedSalary.customBaseSalary).toLocaleString()} 원</p>
//             <p><strong>초과근무 수당:</strong> {Number(selectedSalary.hoursBaseSalary).toLocaleString()} 원</p>
//             <p><strong>총 지급액:</strong> {Number(selectedSalary.grossPay).toLocaleString()} 원</p>
//             <p><strong>실지급액:</strong> {Number(selectedSalary.netPay).toLocaleString()} 원</p>
//             {selectedSalary.deductions && selectedSalary.deductions.length > 0 && (
//               <div>
//                 <h4>공제 내역</h4>
//                 <ul>
//                   {selectedSalary.deductions.map((d, idx) => (
//                     <li key={idx}>
//                       {d.name}: {Number(d.amount).toLocaleString()} 원
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         ) : (
//           <p>급여 항목을 선택해주세요.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     gap: '20px',
//     padding: '20px',
//     fontFamily: 'Segoe UI, sans-serif'
//   },
//   sidebar: {
//     flex: '0 0 30%',
//     backgroundColor: '#f4f6f8',
//     padding: '20px',
//     borderRadius: '8px',
//     boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
//   },
//   heading: {
//     marginBottom: '12px',
//     fontSize: '18px',
//     color: '#333'
//   },
//   select: {
//     width: '100%',
//     padding: '8px',
//     marginBottom: '16px'
//   },
//   list: {
//     listStyle: 'none',
//     padding: 0,
//     margin: 0
//   },
//   listItem: {
//     padding: '10px',
//     borderBottom: '1px solid #ddd',
//     cursor: 'pointer'
//   },
//   detail: {
//     flex: '1',
//     backgroundColor: '#fff',
//     padding: '24px',
//     borderRadius: '8px',
//     boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
//   }
// };

// export default MySalaryHistory;
