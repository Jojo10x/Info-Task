import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import Dashboard from './DashBoard';
import AdminDashboard from './AdminDashBoard';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App
