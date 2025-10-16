// import React from 'react';
// import { Box, Button, Typography, Avatar } from '@mui/material';
// import LogoutIcon from '@mui/icons-material/Logout';

// const Header = ({ title, pictureUrl, userName, onLogout }) => {
//   return (
//     <Box
//       sx={{
//         height: '64px',
//         bgcolor: 'white',
//         color: '#122647',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         borderBottom: '1px solid black',
//         px: 2,
//         mb: 3,
//         width: '100%'
//       }}
//     >
//       <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title}</Typography>

//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//         <Avatar src={pictureUrl} alt={userName} />
//         <Button
//           variant="outlined"
//           startIcon={<LogoutIcon sx={{ color: '#122647' }} />}
//           onClick={onLogout} 
//           sx={{
//             color: '#122647',
//             borderColor: 'white',
//             '&:hover': {
//               color: 'red',
//             },
//           }}
//         >
//           Logout
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default Header;




import React from 'react';
import { Box, Button, Typography, Avatar } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print'; // <-- import Print icon

const Header = ({ title, pictureUrl, userName, onPrint }) => {
  return (
    <Box
      sx={{
        height: '64px',
        bgcolor: 'white',
        color: '#122647',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid black',
        px: 2,
        mb: 3,
        width: '100%',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={pictureUrl} alt={userName} />
        <Button
          variant="outlined"
          startIcon={<PrintIcon sx={{ color: '#122647' }} />}
          onClick={onPrint}
          sx={{
            color: '#122647',
            borderColor: 'white',
            '&:hover': {
              color: '#122647',
              backgroundColor: '#e0e0e0',
            },
          }}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
