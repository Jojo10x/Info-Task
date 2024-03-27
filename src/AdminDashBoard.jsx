import { useNavigate } from 'react-router-dom';
import SummaryReport from './Summary/SummaryReport';
import './App.css'


function AdminDashboard() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      <button className="back-button" onClick={goBack}>Back</button>
      <SummaryReport />
    </div>
  );
}

export default AdminDashboard;

