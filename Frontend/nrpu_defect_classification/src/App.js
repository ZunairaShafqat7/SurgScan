import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Register from './components/register/Register';
import AdminDashboard from './components/admin/admin'
// import Profile from './components/user_dashboard/user_dashboard';
import './App.css';  // Import your CSS
import InspectionPage from './components/inspection/InspectionPage ';
// import StatsPage from './components/stats/StatsPage';
import AdminStatsPage from './components/AdminStatsPage/AdminStatsPage';
import UserDetails from './components/users/user'
import LiveCapture from './components/live/live';
import UserDashboard from './components/dashboard/user_dashboard';
import Account from './components/account/profile';
const App = () => {
  return (
    // <div className="app-container"> {/* Apply the background and centering */}
    //   <div className='app-content'>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<UserDashboard />} />
          <Route path="/inspection" element={<InspectionPage />} />
          {/* <Route path="/stats" element={<StatsPage />} /> */}
          <Route path="/admini/stats-page" element={<AdminStatsPage />} />
          <Route path="/admini/manage-users" element={<UserDetails />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </Router>
    //   </div>
    // </div>
  );
};

export default App;
