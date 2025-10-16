// import React, { useState } from 'react';
// import './user.css'; // Import a CSS file for styles
// import { useLocation, useNavigate } from 'react-router-dom';
// import logo from '../../assets/surgScanLogo.jpg';
// import Box from '@mui/material/Box';

// const UserDetails = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [message, setMessage] = useState("");
    
//     // Ensure all arrays are initialized with fallback empty arrays to avoid undefined issues
//     // const { id = [], name = [], total_batches = [], status = [], userEmail = '' , userId = '', userName = '' } = location.state || {};
//     const {
//         id: initialId = [],
//         name: initialName = [],
//         total_batches: initialBatches = [],
//         status: initialStatus = [],
//         userEmail = '',
//         userId = '',
//         userName = ''
//       } = location.state || {};
      
//       const [id, setId] = useState(initialId);
//       const [name, setName] = useState(initialName);
//       const [total_batches, setTotalBatches] = useState(initialBatches);
//       const [status, setStatus] = useState(initialStatus);
//     //   const [message, setMessage] = useState("");
//     // console.log("In user.js: ", userEmail,userId,userName )

//     // Combine the arrays into objects and filter out any incomplete entries
//     const combinedData = id.map((userId, index) => ({
//         userId,
//         userName: name[index] || '', // Default to empty string if undefined
//         userBatches: total_batches[index] || 0, // Default to 0 if undefined
//         userStatus: status[index] || '', // Default to empty string if undefined
//     }));
//     // Filter admins and users
//     const admins = combinedData.filter(user => user.userStatus === 'admin');
//     const regularUsers = combinedData.filter(user => user.userStatus === 'user');
//     const handleAddUser = async (userEmail) => {
//         const status = 'admin';
//         console.log("userEmail sent to register: ", userEmail);
//         navigate('/register/', { state: { "adminId": userId,  status, "adminEmail": userEmail, "adminName": userName } });
//     };

//     const handleDelete = async (userId, index) => {
//         try {
//             const response = await fetch(`/admini/delete-user/${userId}/`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//             const data = await response.json();
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             else{ 
//                 const updated = data.updated_data || {};
//                 setId(updated.id || []);
//                 setName(updated.name || []);
//                 setTotalBatches(updated.total_batches || []);
//                 setStatus(updated.status || []);
//                 setMessage(data.message || "User DELETED successfully.");
//             }
//         } catch (error) {
//             console.error("Failed to delete user:", error);
//             setMessage("An error occurred while deleting the user.");
//         }
//     };

//     const handleEdit = (Id) => {
//         const status = 'admin';
//         console.log("Edit user with ID:", Id);
//         navigate('/register/', { state: { "userId":Id, "adminId": userId,  status, "adminEmail": userEmail, "adminName": userName } });
//     };

//     const handleDashboard = async (event) => {
//         event.preventDefault(); // Prevent the default form submission
//         const { userId, userName } = location.state || {};
//         // const {} = userId, userName;
//         // console.log(name, id);
//         try {
//           const response = await fetch('/api/dashboard/', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ 'name': {userName} ,"id": userId }), // Send the userEmail and password in the request body
//           });
      
//           const data = await response.json(); // Parse the response as JSON
      
//           if (response.ok) {
//             setMessage(data.message);
            
    
//             // Navigate with state
//             if (data.status === 'admin') {
//               const userDetails = {
//                 name: data.name,
//                 id: data.id,
//                 email: data.email,
//                 number: data.number,
//                 status: data.status,
//                 pictureUrl: data.picture_url,
//                 date: data.created_at_date,
//                 time: data.created_at_time,
//                 batchDetails: data.batch_details,
//               };
        
//               navigate('/admin-dashboard/', { state: { userDetails } });
//             } else if (data.status === 'user') {
//               const userDetails = {
//                 name: data.name,
//                 id: data.id,
//                 email: data.email,
//                 number: data.number,
//                 status: data.status,
//                 pictureUrl: data.picture_url,
//                 date: data.created_at_date,
//                 time: data.created_at_time,
//                 batchDetails: data.batch_details,
//               };
//               navigate('/user-dashboard/', { state: { userDetails } });
//             }
//           } else {
//             setMessage(data.message);
//           }
//         } catch (error) {
//           console.error('Error:', error);
//           setMessage('An error occurred.');
//         }
//       };

//     return (
//         <div className="user-details-container">
//             <header className="header">
//                     <Box
//                         sx={{ display: 'inline-block', fontSize: 0 }}
//                     >
//                                     <div className="logo">
//                                         <img src={logo} alt="SurgScan" />
//                                     </div>
//                     </Box>
//                 <h1>User Details</h1>
//                 <button className="dashboard-button" onClick={handleDashboard}>Dashboard</button>
//             </header>

//             <div className="action-buttons">
//                 <button className="add-user-button" onClick={() => handleAddUser(userEmail)}>Add User</button>
//             </div>

//             {message && <p className="message_user">{message}</p>}

//             <h2>Admins</h2>
//             <table className="user-table">
//                 <thead>
//                     <tr>
//                         <th>User ID</th>
//                         <th>User Name</th>
//                         <th>No of Batches</th>
//                         <th>Delete</th>
//                         <th>Edit</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {admins.map((admin, index) => (
//                         <tr key={admin.userId} className="user-table">
//                             <td>{admin.userId}</td>
//                             <td>{admin.userName}</td>
//                             <td>{admin.userBatches}</td>
//                             <td>
//                                 <button className="delete-button" onClick={() => handleDelete(admin.userId, index)}>Delete</button>
//                             </td>
//                             <td>
//                                 <button className="edit-button" onClick={() => handleEdit(admin.userId)}>Edit</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             <h2>Users</h2>
//             <table className="user-table">
//                 <thead>
//                     <tr
//                     >
//                         <th>User ID</th>
//                         <th>User Name</th>
//                         <th>No of Batches</th>
//                         <th>Delete</th>
//                         <th>Edit</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {regularUsers.map((user, index) => (
//                         <tr key={user.userId}>
//                             <td>{user.userId}</td>
//                             <td>{user.userName}</td>
//                             <td>{user.userBatches}</td>
//                             <td>
//                                 <button className="delete-button" onClick={() => handleDelete(user.userId, index)}>Delete</button>
//                             </td>
//                             <td>
//                                 <button className="edit-button" onClick={() => handleEdit(user.userId)}>Edit</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default UserDetails;






import React, { useState, useEffect } from 'react'; // Add useEffect
import './user.css';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/surgScanLogo.jpg';
import Box from '@mui/material/Box';

const UserDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize state with fallback empty arrays
    const {
        id: initialId = [],
        name: initialName = [],
        total_batches: initialBatches = [],
        status: initialStatus = [],
        userEmail = '',
        userId = '',
        userName = '',
        message: log,
    } = location.state || {};

    const [id, setId] = useState(initialId);
    const [name, setName] = useState(initialName);
    const [total_batches, setTotalBatches] = useState(initialBatches);
    const [status, setStatus] = useState(initialStatus);
    const [message, setMessage] = useState(log || '');

    // Fetch user data when component mounts or after successful registration
    useEffect(() => {
        // If state is empty, fetch initial data
        if (!id.length) {
            const fetchUsers = async () => {
                try {
                    const response = await fetch('/admini/get-users/', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    const data = await response.json();
                    setId(data.id || []);
                    setName(data.name || []);
                    setTotalBatches(data.total_batches || []);
                    setStatus(data.status || []);
                } catch (error) {
                    console.error('Failed to fetch users:', error);
                    setMessage('An error occurred while fetching users.');
                }
            };
            fetchUsers();
        }
    }, [id.length]);

    // Combine the arrays into objects and filter out incomplete entries
    const combinedData = id.map((userId, index) => ({
        userId,
        userName: name[index] || '',
        userBatches: total_batches[index] || 0,
        userStatus: status[index] || '',
    }));

    const admins = combinedData.filter(user => user.userStatus === 'admin');
    const regularUsers = combinedData.filter(user => user.userStatus === 'user');

    const handleAddUser = () => {
        navigate('/register/', {
            state: { adminId: userId, status: 'admin', adminEmail: userEmail, adminName: userName }
        });
    };

    const handleDelete = async (userId, index) => {
        try {
            const response = await fetch(`/admini/delete-user/${userId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            setId(data.updated_data?.id || []);
            setName(data.updated_data?.name || []);
            setTotalBatches(data.updated_data?.total_batches || []);
            setStatus(data.updated_data?.status || []);
            setMessage(data.message || 'User deleted successfully.');
        } catch (error) {
            console.error('Failed to delete user:', error);
            setMessage('An error occurred while deleting the user.');
        }
    };

    const handleEdit = (Id) => {
        navigate('/register/', {
            state: { userId: Id, adminId: userId, status: 'admin', adminEmail: userEmail, adminName: userName }
        });
    };

    const handleDashboard = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/dashboard/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: userName, id: userId }),
            });

            const data = await response.json();
            if (response.ok) {
                const userDetails = {
                    name: data.name,
                    id: data.id,
                    email: data.email,
                    number: data.number,
                    status: data.status,
                    pictureUrl: data.picture_url,
                    date: data.created_at_date,
                    time: data.created_at_time,
                    batchDetails: data.batch_details,
                };
                if (data.status === 'admin') {
                    navigate('/admin-dashboard/', { state: { userDetails } });
                } else if (data.status === 'user') {
                    navigate('/user-dashboard/', { state: { userDetails } });
                }
            } else {
                setMessage(data.message || 'Failed to access dashboard.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred.');
        }
    };

    return (
        <div className="user-details-container">
            <header className="header">
                <Box sx={{ display: 'inline-block', fontSize: 0 }}>
                    <div className="logo">
                        <img src={logo} alt="SurgScan" />
                    </div>
                </Box>
                <h1>User Details</h1>
                <button className="dashboard-button" onClick={handleDashboard}>Dashboard</button>
            </header>

            <div className="action-buttons">
                <button className="add-user-button" onClick={handleAddUser}>Add User</button>
            </div>

            {message && <p className="message_user">{message}</p>}

            <h2>Admins</h2>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>User Name</th>
                        <th>No of Batches</th>
                        <th>Delete</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((admin, index) => (
                        <tr key={admin.userId}>
                            <td>{admin.userId}</td>
                            <td>{admin.userName}</td>
                            <td>{admin.userBatches}</td>
                            <td>
                                <button className="delete-button" onClick={() => handleDelete(admin.userId, index)}>Delete</button>
                            </td>
                            <td>
                                <button className="edit-button" onClick={() => handleEdit(admin.userId)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Users</h2>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>User Name</th>
                        <th>No of Batches</th>
                        <th>Delete</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {regularUsers.map((user, index) => (
                        <tr key={user.userId}>
                            <td>{user.userId}</td>
                            <td>{user.userName}</td>
                            <td>{user.userBatches}</td>
                            <td>
                                <button className="delete-button" onClick={() => handleDelete(user.userId, index)}>Delete</button>
                            </td>
                            <td>
                                <button className="edit-button" onClick={() => handleEdit(user.userId)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserDetails;