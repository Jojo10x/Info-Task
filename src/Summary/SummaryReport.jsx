import  { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase-config';
import styles from './Summary.module.css'

function SummaryReport() {
  const [managerReports, setManagerReports] = useState([]);
  const [summary, setSummary] = useState({ totalRevenue: 0 });
  const [displayMode, setDisplayMode] = useState('all'); 
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); 
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); 
  useEffect(() => {
    const fetchReports = async () => {
      let querySnapshot;

      if (displayMode === 'all') {
        querySnapshot = await getDocs(collection(db, 'myCollection'));
      } else if (displayMode === 'monthly') {

        const startDate = new Date(selectedYear, selectedMonth - 1, 1);
        const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59);
        const q = query(collection(db, 'myCollection'), where('field4', '>=', startDate), where('field4', '<=', endDate));
        querySnapshot = await getDocs(q);
      } else if (displayMode === 'daily') {

        const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 23, 59, 59);
        const q = query(collection(db, 'myCollection'), where('field4', '>=', startDate), where('field4', '<=', endDate));
        querySnapshot = await getDocs(q);
      }

      const reportsData = querySnapshot.docs.map(doc => doc.data());

      if (reportsData.length === 0) {
        setManagerReports([]);
      } else {
        const uniqueDates = [...new Set(reportsData.map(report => report.field4.toDate().toDateString()))];
        
        const reportsByDate = uniqueDates.map(date => ({
          date,
          reports: reportsData.filter(report => report.field4.toDate().toDateString() === date)
        }));

        setManagerReports(reportsByDate);
      }
      
      const totalRevenue = reportsData.reduce((acc, report) => acc + parseFloat(report.field3), 0);
      setSummary({ totalRevenue });
    };

    fetchReports();
  }, [displayMode, selectedDate, selectedMonth, selectedYear]); 

  return (
    <div className={styles.container}>
      <h3>Manager Reports</h3>

      <button className={styles.button} onClick={() => setDisplayMode('all')}>All Reports</button>
      <button className={styles.button} onClick={() => setDisplayMode('monthly')}>Monthly Reports</button>
      <button className={styles.button} onClick={() => setDisplayMode('daily')}>Daily Reports</button>

      {displayMode === 'monthly' && (
        <div className={styles.select}>
          <select value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>{new Date(selectedYear, month - 1).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))}>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}

      {displayMode === 'daily' && (
        <input className={styles.dateInput} type="date" value={selectedDate.toISOString().split('T')[0]} onChange={e => setSelectedDate(new Date(e.target.value))} />
      )}

      {managerReports.length === 0 ? (
        <p className={styles.report}>No reports available for this {displayMode === 'daily' ? 'day' : 'month'}.</p>
      ) : (
        managerReports.map(({ date, reports }) => (
          <div className={styles.report} key={date}>
            <h4>Date: {date}</h4>
            {reports.map(report => (
              <div key={report.field1}>
                <p>Manager: {report.field1}</p>
                <p>Revenue: {report.field3}</p>
              </div>
            ))}
          </div>
        ))
      )}

      <h3 className={styles.summary}>Summary Report</h3>
      <p className={styles.summary}>Total Revenue: {summary.totalRevenue.toFixed(2)}</p>
    </div>
  );
}

export default SummaryReport;
