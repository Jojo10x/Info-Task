import DailyReport from './Report/DailyReport';
import { useNavigate } from 'react-router-dom';
import './App.css'


function Dashboard() {
    const navigate = useNavigate();

    const goBack = () => {
      navigate(-1);
    };
  return (
    <div className="admin-dashboard-container">
      <h2>Dashboard</h2>
      <button className="back-button" onClick={goBack}>Back</button>
      <DailyReport />
    </div>
  );
}

export default Dashboard;

