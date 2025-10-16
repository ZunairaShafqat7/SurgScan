import React, { useState, useEffect } from 'react';
import './admin.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userDetails } = location.state || {}; // Retrieve the user details from state
  const [name, setName] = useState(userDetails?.name || '');
  const [pictureUrl, setPictureUrl] = useState(userDetails?.pictureUrl || '');
  const [email, setEmail] = useState(userDetails?.email || '');
  const [designation, setDesignation] = useState(userDetails?.designation || '');
  const [contact, setContact] = useState(userDetails?.contact || '');

  const [totalUsers, setTotalUsers] = useState(userDetails?.total_users || 0);
const [totalBatches, setTotalBatches] = useState(userDetails?.total_batches || 0);
const [inprogressBatches, setInprogressBatches] = useState(userDetails?.inprogress_batches || 0);
const [completedBatches, setCompletedBatches] = useState(userDetails?.completed_batches || 0);
  const [message, setMessage] = useState('');
  
  const handleViewStats = async () => {

    try {
        const response = await fetch('/admini/stats/', {
            method: 'GET',  // Use 'POST' if your API requires it
            headers: {
                'Content-Type': 'application/json',  // Adjust headers if necessary
                // Add any other headers if required, such as Authorization
            },
            // body: formData,  // Uncomment this if your endpoint expects a body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const { batches } = data;
        // Navigate to the stats page with the fetched data
        navigate('/admini/stats-page', { state: { batches } });
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        setMessage('An error occurred while fetching stats.');
    }
};






  const handleLogout = () => {
    // Redirect to the login page
    navigate('/'); // Replace '/login' with your login route
  };
  const handleManageUsers = async () => {
    try {
        const response = await fetch('/admini/get-users/', {
            method: 'GET',  // Use 'POST' if your API requires it
            headers: {
                'Content-Type': 'application/json',  // Adjust headers if necessary
                // Add any other headers if required, such as Authorization
            },
            // body: formData,  // Uncomment this if your endpoint expects a body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const { id , name , total_batches,status } = data;
        // console.log(data,"\n\n\n",id , name , total_batches)
        // Navigate to the stats page with the fetched data
        console.log("Tracking email in admin dashboard:" , email)
        navigate('/admini/manage-users', { state: { id , name , total_batches,status, email} });
    } catch (error) {
        console.error("Failed to fetch stats:", error);
        setMessage('An error occurred while fetching stats.');
    }
};
  useEffect(() => {}, [userDetails]);

  return (
    <div className="admin-dashboard-container">
      {/* Full-Width Top Bar */}
      <div className="top-bar">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <span className="admin-email">{email}</span>
      </div>

      {/* Main Content */}
      <div className="admin-dashboard">
        {/* Admin Details Card */}
        <div className="admin-details-card">
          <h2>Admin Details</h2>
          <div className="admin-details-content">
            {/* Labels */}
            <div className="labels-container">
              <p><strong>Name:</strong></p>
              <p><strong>Email:</strong></p>
              <p><strong>Designation:</strong></p>
              <p><strong>Contact No:</strong></p>
            </div>
            {/* Corresponding Values */}
            <div className="values-container">
              <p>{name}</p>
              <p>{email}</p>
              <p>{designation}</p>
              <p>{contact}</p>
            </div>
          </div>
        </div>

        {/* Admin Image and Name */}
        <div className="admin-image-card">
          <img src={pictureUrl} alt="Admin" className="admin-image" />
          <p className="admin-name">{name}</p>
        </div>
      </div>


      {/* Other Detail Section */}
        <div className="other-detail-card">
            <h3>Other Detail</h3>
            
            <div className="batch-user-stats">
                <div className="total-batches">
                    <h3>Total Batches</h3>
                    <div className="batch-details-content">
                        <div className="batch-labels">
                            <p>Total:</p>
                            <p>In progress:</p>
                            <p>Completed:</p>
                        </div>
                        <div className="batch-values">
                            <p>{totalBatches}</p>
                            <p>{inprogressBatches}</p>
                            <p>{completedBatches}</p>
                        </div>
                    </div>
                </div>

                <div className="total-users">
                    <h3>Total Users</h3>
                    <div className="user-details-content">
                        <div className="user-labels">
                            <p>Registered:</p>
                        </div>
                        <div className="user-values">
                            <p>{totalUsers}</p>
                        </div>
                    </div>
                </div>
            </div>



        </div>
        {/* Buttons Section */}
        <div className="admin-buttons">
            <button onClick={handleManageUsers}>Manage Users</button>
            <button onClick={handleViewStats}>View Stats</button>
            <button onClick={handleLogout} className="logout-btn">LogOut</button>
        </div>
    </div>
  );
};

export default AdminDashboard;
