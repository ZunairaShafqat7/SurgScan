// import React, { useEffect,useState } from 'react';
// import { Box } from '@mui/material';
// import InputField from '../InputField';
// import RegisterFormContainer from '../registration_form/RegisterFormContainer';
// import './Register.css';  // Ensure the corresponding CSS is included
// import ErrorMessage from '../ErrorMessage';
// import Button from '../button';
// import { useNavigate,useLocation  } from 'react-router-dom';
// import { Select, MenuItem } from '@mui/material';
// import { FormControl, InputLabel, OutlinedInput, FormHelperText } from '@mui/material';

// const Register = () => {
//   const location = useLocation();
//   const { userId } = location.state || {};
//   console.log("Editing UserId:" , userId)
//   // userId, adminId,  status, userEmail, userName
//   const {adminId , adminEmail, adminName  } = location.state || {};
//   console.log("Editing using Admin:" , adminId, adminEmail,  adminName)
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [number, setNumber] = useState('');
//   const [adminPassword, setAdminPassword] = useState('');
//   const [image, setImage] = useState(null);
//   const [role, setRole] = useState('user');
//   const [designation, setDesignation] = useState(''); // State for designation
//   const [message, setMessage] = useState('');
//   const [isEditing, setIsEditing] = useState(false); // To check if it's an edit form

//   const navigate = useNavigate();



//   useEffect(() => {
//     if (userId) {
//       setIsEditing(true);
//       // Fetch user data from backend
//       const fetchUserData = async () => {
//         try {
//           const response = await fetch(`/api/get-user/${userId}/`, {
//             method: 'GET',
//           });
//           const data = await response.json();

//           if (response.ok) {
//             // Populate form with user data
//             setEmail(data.email);
//             setName(data.name);
//             setNumber(data.number);
//             setRole(data.status);
//             if (data.status === 'admin' ){
//               setDesignation(data.designation)
//             }
//             setMessage('User data loaded successfully.');
//           } else {
//             setMessage('Failed to load user data.');
//           }
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//           setMessage('An error occurred while fetching user data.');
//         }
//       };

//       fetchUserData();
//     }
//   }, [userId]);




//   const handleLogout = () => {
//     navigate('/');
//   };
//   // Handle registration form submission
//   const handleRegister = async (event) => {
//     event.preventDefault();

//     // Create FormData for file upload and other form data
//     const formData = new FormData();
//     formData.append('email', email);
//     formData.append('password', password);
//     formData.append('name', name);
//     formData.append('number', number);
//     formData.append('adminPassword', adminPassword);
//     formData.append('role', role);
//     formData.append('image', image);

//     if (role === 'admin') {
//       formData.append('designation', designation); // Add designation for admin
//     }

//     try {
//       let response;
//       if (isEditing) {
//         const { status } = location.state || {};
//         formData.append('status', status);
//         response = await fetch(`/api/update-user/${userId}/`, {
//           method: 'POST',
//           body: formData,
//         });
//       }
//       else{ 
//           // Send POST request to your backend API
//             response = await fetch('/api/register/', {
//             method: 'POST',
//             body: formData,
//           });
//         }
//           const data = await response.json();
//           const { status,email } = location.state || {};//************** */
//           console.log(status,email)
//           if (response.ok) {
//               if (status === 'user'){ 
//                   setMessage('Registration successful!');
//                   navigate('/');
//               }
//               else{

//                   try {
//                     const response = await fetch('/admini/get-users/', {
//                         method: 'GET',  // Use 'POST' if your API requires it
//                         headers: {
//                             'Content-Type': 'application/json',  // Adjust headers if necessary
//                             // Add any other headers if required, such as Authorization
//                         },
//                         // body: formData,  // Uncomment this if your endpoint expects a body
//                     });
            
//                     if (!response.ok) {
//                         throw new Error(`HTTP error! Status: ${response.status}`);
//                     }
            
//                     const data = await response.json();
//                     const { id , name , total_batches,status } = data;
//                     // console.log(data,"\n\n\n",id , name , total_batches)
//                     // Navigate to the stats page with the fetched data
//                     const { email } = location.state || {};
//                     setMessage(isEditing ? 'User updated successfully!' : 'User Registration successful!');
//                     // console.log(adminEmail,adminId,adminName)
//                     navigate('/admini/manage-users', { state: { id , name , total_batches,status, "userEmail": adminEmail, "userId": adminId, "userName": adminName} });
//                 } catch (error) {
//                     console.error("Failed to fetch stats:", error);
//                     setMessage('An error occurred while fetching stats.');
//                 }









                  
//               }
//           } else {
//             if (status === 'user'){ 
//               if (data.message === 'Email cannot be used.') {
//                 setMessage('This email cannot be used because it is inactive. Please use a different email.');
//                 // Do not navigate, stay on the form
//               } else {
//                 setMessage(data.message || 'Registration failed.');
//               }
//               // navigate('/');
//             }
//             else{
//               // setMessage(data.message || 'Registration failed.');
//               // navigate('/');

//                       try {
//                         const response = await fetch('/admini/get-users/', {
//                             method: 'GET',  // Use 'POST' if your API requires it
//                             headers: {
//                                 'Content-Type': 'application/json',  // Adjust headers if necessary
//                                 // Add any other headers if required, such as Authorization
//                             },
//                             // body: formData,  // Uncomment this if your endpoint expects a body
//                         });
                
//                         if (!response.ok) {
//                             throw new Error(`HTTP error! Status: ${response.status}`);
//                         }
                
//                         const data = await response.json();
//                         const { id , name , total_batches } = data;
//                         // console.log(data,"\n\n\n",id , name , total_batches)
//                         // Navigate to the stats page with the fetched data
//                         const { email } = location.state || {};
//                         setMessage(isEditing ? 'Updation failed.' : 'Registration failed.');
//                         navigate('/admini/manage-users', { state: { id , name , total_batches, status, email} });
//                     } catch (error) {
//                         console.error("Failed to fetch stats:", error);
//                         setMessage('An error occurred while fetching stats.');
//                     }
//             }
//           }
        
//     } catch (error) {
//       console.error('Error:', error);
//       setMessage('An error occurred while registering.');
//     }
//   };

//   return (
//     <RegisterFormContainer>
//       <form onSubmit={handleRegister} encType="multipart/form-data">
//       <div className="header_bar">
//         <h1 className='header_title'>Register for Optical Inspection</h1>
//         <button className="header_button" onClick={handleLogout}>LogOut</button>
//       </div>

//         {/* <h1>Register for Optical Inspection</h1> */}
//         <div className="content">

//                 <FormControl variant="outlined" fullWidth margin="normal">
//                           <InputLabel htmlFor="email">Email Address</InputLabel>
//                           <OutlinedInput
//                             id="email"
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             label="Email Address"
//                           />
//                 </FormControl>
                
//                 <FormControl variant="outlined" fullWidth margin="normal">
//                     <InputLabel htmlFor="password">Password</InputLabel>
//                     <OutlinedInput
//                       id="password"
//                       type="password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       label="Password"
//                     />
//                 </FormControl>

//                 <FormControl variant="outlined" fullWidth margin="normal">
//                           <InputLabel htmlFor="text">Name</InputLabel>
//                           <OutlinedInput
//                             id="name"
//                             type="text"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             label="Name"
//                           />
//                 </FormControl>

//                 <FormControl variant="outlined" fullWidth margin="normal">
//                           <InputLabel htmlFor="number">Number</InputLabel>
//                           <OutlinedInput
//                             id="number"
//                             type="number"
//                             value={number}
//                             onChange={(e) => setNumber(e.target.value)}
//                             label="Number"
//                           />
//                 </FormControl>
           
//                 <FormControl variant="outlined" fullWidth margin="normal">
//                     <InputLabel htmlFor="password">Admin Password</InputLabel>
//                     <OutlinedInput
//                       id="password"
//                       type="password"
//                       value={adminPassword}
//                       onChange={(e) => setAdminPassword(e.target.value)}
//                       label="Admin Password"
//                     />
//                 </FormControl>

          
          
//                 <FormControl fullWidth margin="normal">
//                       <InputLabel shrink htmlFor="file">Image</InputLabel>
//                       <InputField
//                         id="file"
//                         type="file"
//                         onChange={(e) => setImage(e.target.files[0])}
//                         accept=".jpg, .jpeg, .png"
//                       />
//                 </FormControl>

        
//           <FormControl fullWidth margin="normal">
//                 <InputLabel id="role-label">Role</InputLabel>
//                 <Select
//                   labelId="role-label"
//                   id="role"
//                   value={role}
//                   label="Role"
//                   onChange={(e) => setRole(e.target.value)}
//                 >
//                   <MenuItem value="user">User</MenuItem>
//                   <MenuItem value="admin">Admin</MenuItem>
//                 </Select>
//           </FormControl>


//           {role === 'admin' && (
//             <FormControl variant="outlined" fullWidth margin="normal">
//                           <InputLabel htmlFor="text">Designation</InputLabel>
//                           <OutlinedInput
//                             id="designation"
//                             type="text"
//                             value={designation}
//                             onChange={(e) => setDesignation(e.target.value)}
//                             label="Designation"
//                           />
//               </FormControl>
//           )}

//           {message && <ErrorMessage message={message} />}
//         </div>
//         <div className="action">
//           <Button label="Register" type="submit" className="primary" />
//         </div>
//       </form>
//     </RegisterFormContainer>
//   );
// };

// export default Register;







import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import InputField from '../InputField';
import RegisterFormContainer from '../registration_form/RegisterFormContainer';
import './Register.css';
import ErrorMessage from '../ErrorMessage';
import Button from '../button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Select, MenuItem, FormControl, InputLabel, OutlinedInput } from '@mui/material';

const Register = () => {
    const location = useLocation();
    const { userId, adminId, status: initialStatus, adminEmail, adminName } = location.state || {};
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [image, setImage] = useState(null);
    const [role, setRole] = useState(initialStatus || 'user'); // Use initialStatus from location.state
    const [designation, setDesignation] = useState('');
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(!!userId);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            setIsEditing(true);
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`/api/get-user/${userId}/`, {
                        method: 'GET',
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setEmail(data.email);
                        setName(data.name);
                        setNumber(data.number);
                        setRole(data.status);
                        if (data.status === 'admin') {
                            setDesignation(data.designation);
                        }
                        setMessage('User data loaded successfully.');
                    } else {
                        setMessage('Failed to load user data.');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setMessage('An error occurred while fetching user data.');
                }
            };
            fetchUserData();
        }
    }, [userId]);

    const handleLogout = () => {
        navigate('/');
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('name', name);
        formData.append('number', number);
        formData.append('adminPassword', adminPassword);
        formData.append('role', role);
        formData.append('image', image);

        if (role === 'admin') {
            formData.append('designation', designation);
        }

        try {
            let response;
            if (isEditing) {
                formData.append('status', initialStatus || role);
                response = await fetch(`/api/update-user/${userId}/`, {
                    method: 'POST',
                    body: formData,
                });
            } else {
                response = await fetch('/api/register/', {
                    method: 'POST',
                    body: formData,
                });
            }

            const data = await response.json();

            if (response.ok) {
                if (initialStatus === 'user') {
                    setMessage('Registration successful!');
                    navigate('/');
                } else {
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
                        const { id, name, total_batches, status } = data;
                        setMessage(isEditing ? 'User updated successfully!' : 'User registration successful!');
                        navigate('/admini/manage-users', {
                            state: {
                                id,
                                name,
                                total_batches,
                                status,
                                userEmail: adminEmail,
                                userId: adminId,
                                userName: adminName,
                                message: isEditing ? 'User ---'+ String(email) + '--- updated successfully!' : 'User ---'+ String(email) + '--- registration successful!',
                            },
                        });
                    } catch (error) {
                        console.error('Failed to fetch stats:', error);
                        setMessage('An error occurred while fetching stats.');
                    }
                }
            } else {
                if (data.error_code === 'INACTIVE_EMAIL') {
                    setMessage('This email cannot be used because it is inactive. Please use a different email.');
                    // Stay on the form
                } else if(data.error_code === 'Email_already_registered'){
                    setMessage('This email cannot be used because it is already ACTIVE. Please use a different email.');
                } 
                else if(data.error_code === 'INVALID_ADMIN_PASSWORD'){
                  setMessage('Admin Password Incorrect!');
                }
                else if(data.error_code === 'INVALID_ADMIN_PRIVILEDGE'){
                  setMessage('Access Denied, Only ADMIN have this Priviledge!');
                }
                else {
                    setMessage(data.message || (isEditing ? 'User update failed.' : 'Registration failed.'));
                    if (initialStatus === 'user') {
                        navigate('/');
                    } else {
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
                            const { id, name, total_batches, status } = data;
                            navigate('/admini/manage-users', {
                                state: {
                                    id,
                                    name,
                                    total_batches,
                                    status,
                                    userEmail: adminEmail,
                                    userId: adminId,
                                    userName: adminName,
                                },
                            });
                        } catch (error) {
                            console.error('Failed to fetch stats:', error);
                            setMessage('An error occurred while fetching stats.');
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while registering.');
        }
    };

    return (
        <RegisterFormContainer>
            <form onSubmit={handleRegister} encType="multipart/form-data">
                <div className="header_bar">
                    <h1 className="header_title">Register for Optical Inspection</h1>
                    <button className="header_button" onClick={handleLogout}>LogOut</button>
                </div>

                <div className="content">
                    <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel htmlFor="email">Email Address</InputLabel>
                        <OutlinedInput
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email Address"
                        />
                    </FormControl>

                    <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
                        />
                    </FormControl>

                    <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <OutlinedInput
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            label="Name"
                        />
                    </FormControl>

                    <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel htmlFor="number">Number</InputLabel>
                        <OutlinedInput
                            id="number"
                            type="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            label="Number"
                        />
                    </FormControl>

                    <FormControl variant="outlined" fullWidth margin="normal">
                        <InputLabel htmlFor="adminPassword">Admin Password</InputLabel>
                        <OutlinedInput
                            id="adminPassword"
                            type="password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            label="Admin Password"
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel shrink htmlFor="file">Image</InputLabel>
                        <InputField
                            id="file"
                            type="file"
                            onChange={(e) => setImage(e.target.files[0])}
                            accept=".jpg, .jpeg, .png"
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            id="role"
                            value={role}
                            label="Role"
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>

                    {role === 'admin' && (
                        <FormControl variant="outlined" fullWidth margin="normal">
                            <InputLabel htmlFor="designation">Designation</InputLabel>
                            <OutlinedInput
                                id="designation"
                                type="text"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                label="Designation"
                            />
                        </FormControl>
                    )}

                    {message && <ErrorMessage message={message} />}
                </div>
                <div className="action">
                    <Button label={isEditing ? 'Update' : 'Register'} type="submit" className="primary" />
                </div>
            </form>
        </RegisterFormContainer>
    );
};

export default Register;