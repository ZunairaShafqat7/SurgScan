import {React, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TableChartIcon from '@mui/icons-material/TableChart';
import LogoutIcon from '@mui/icons-material/Logout';

const UserSideNav = ({ status, onLogout, onProfileClick, onHomeRedirect, OnManageUsers, state }) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(state);
  const handleNavigation = (path) => {
    navigate(path);
  };

  

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        bgcolor: '#122647',
        color: 'white',
        borderRight: '1px solid #ddd',
        position: 'fixed',
        top: 0,
        left: 0,
        pt: 8, // to give space if you have a fixed top navbar
      }}
    >
      <List>
        <ListItem disablePadding
        onClick={() => setSelectedItem('home')}
        >
          <ListItemButton 
          onClick={onHomeRedirect}

          sx={{
              bgcolor: selectedItem === 'home' ? '#154894' : '#122647',
              color: selectedItem === 'home' ? '#fff' : 'white',
          }}
          >
            <ListItemIcon sx={{ color: 'white' }}><HomeIcon /></ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding
        onClick={() => setSelectedItem('profile')}
        >
          <ListItemButton onClick={onProfileClick}
          sx={{
            bgcolor: selectedItem === 'profile' ? '#154894' : '#122647',
            color: selectedItem === 'profile' ? '#fff' : 'white',
          }}
          >
            <ListItemIcon sx={{ color: 'white' }}><AccountCircleIcon /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>

        {status === 'admin' && (
          <ListItem disablePadding
          onClick={() => setSelectedItem('admin')}
          >
            <ListItemButton onClick={OnManageUsers}
            sx={{
              bgcolor: selectedItem === 'admin' ? '#154894' : '#122647',
              color: selectedItem === 'admin' ? '#fff' : 'white',
            }}
            >
              <ListItemIcon sx={{ color: 'white' }}><TableChartIcon /></ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </ListItem>
        )}

        <Divider sx={{ my: 2 }} />

        <ListItem disablePadding
        sx={{
          '&:hover': {
            bgcolor: '#154894', // background color on hover
            color: '#fff',
          },
          color: 'white',
        }}
        >
          <ListItemButton onClick={onLogout}>
            <ListItemIcon sx={{ color: 'white' }}><LogoutIcon color="error" /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default UserSideNav;
