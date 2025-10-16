import React , { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserSideNav from '../dashboard/sidebar/Sidebar';
import { Box, Grid } from '@mui/material';
import { AccountInfo } from './AccountInfo';
import { AccountDetailsForm } from './AccountDetailsForm';

export default function Account() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState('');
  const { uname, uid, uemail, ustatus, upictureUrl, unumber } = location.state || {};
  // const {
  //   name: userName,
  //   id: userId,
  //   email: userEmail,
  //   status: userStatus,
  //   pictureUrl: userPicture,
  //   number: userNumber,
  // } = location.state || {};
  

  const handleProfileClick = () => {
    navigate('/account', {
      state: {
        uname,
        uid,
        uemail,
        ustatus,
        unumber,
        upictureUrl,
      },
    });
  };
  
  const handleLogout = () => {
    navigate('/');
  };


  const onHomeRedirect = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const { uname, uid } = location.state || {};
    // console.log(name, id);
    try {
      const response = await fetch('/api/dashboard/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "name": uname, "id": uid }), // Send the email and password in the request body
      });
  
      const data = await response.json(); // Parse the response as JSON
  
      if (response.ok) {
        setMessage(data.message);
        

        // Navigate with state
        if (data.status === 'admin') {
          // const userDetails = {
          //   name: data.name,
          //   email: data.email,
          //   pictureUrl: data.picture_url,
          //   designation: data.designation,
          //   contact: data.contact,
          //   total_users: data.total_users,
          //   total_batches: data.total_batches,
          //   inprogress_batches: data.inprogress_batches,
          //   completed_batches: data.completed_batches,
          // };
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
          navigate('/admin-dashboard/', { state: { userDetails } });
        } else if (data.status === 'user') {
          // const userDetails = {
          //   name: data.name,
          //   id: data.id,
          //   email: data.email,
          //   number: data.number,
          //   pictureUrl: data.picture_url,
          //   date: data.created_at_date,
          //   time: data.created_at_time,
          //   batchDetails: data.batch_details,
          // };
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
          navigate('/user-dashboard/', { state: { userDetails } });
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred.');
    }
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
            // const { userIds , UserNames , Total_Batches , UserSatus } = data;
            const { id , name , total_batches,status } = data;
            navigate('/admini/manage-users', { state: { id , name , total_batches, status, "userEmail": uemail , "userId": uid , "userName": uname} });
        } catch (error) {
            console.error("Failed to fetch stats:", error);
            setMessage('An error occurred while fetching stats.');
        }
    };
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar */}
      <UserSideNav status={ustatus} onLogout={handleLogout} onProfileClick={handleProfileClick} onHomeRedirect={onHomeRedirect} OnManageUsers={handleManageUsers} state={"profile"} />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: '240px', p: 4 }}>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ height: '100vh' }}
        >
          <Grid item xs={12} md={12} lg={5}>
            <Box>
              <AccountInfo
                name={uname}
                id={uid}
                email={uemail}
                number={unumber}
                pictureUrl={upictureUrl}
              />
            </Box>
            <Box>
              <AccountDetailsForm
                name={uname}
                id={uid}
                email={uemail}
                number={unumber}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
