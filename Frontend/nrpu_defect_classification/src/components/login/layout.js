import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import logo from '../../assets/surgScanLogo.jpg'; // Replace with your actual logo path or use an <h1> fallback
import hecLogo from '../../assets/hec.jpg'
import fast from '../../assets/fast.jpg'
import drFrigzLogo from '../../assets/drFrigz.png'
import daddyDProLogo from '../../assets/daddyDPro.png'
import scissor from '../../assets/scissor.jpg'
import forcep from '../../assets/forcep.jpg'
import nailClipper from '../../assets/nail clipper.jpg'
import background from '../../assets/background.JPG'
import './layout.css'
export function Layout({ children }) {
  return (
    <Box
      sx={{
        display: { xs: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100vh',
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    backgroundImage: `url(${nailClipper})`, // update path accordingly
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat', }}>
        {/* Logo */}
        <Box sx={{ p: 3 }}>
          <Box
            component={Link}
            to="/"
            sx={{ display: 'inline-block', fontSize: 0 }}
          >
            {/* <img src={logo} alt="App Logo" height={32} width={122} /> */}
            <div className="sponsors">
                        <div className="sponsor-logo">
                            <img src={logo} alt="Sponsor 1" />
                        </div>
            </div>
          </Box>
        </Box>

        {/* Centered Children */}
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flex: '1 1 auto',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <Box sx={{ maxWidth: '450px', width: '100%' }}>{children}</Box>
        </Box>
      </Box>

      {/* Right Section (for large screens) */}
      <Box
        sx={{
          alignItems: 'center',
          background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
          color: 'white',
          display: { xs: 'none', lg: 'flex' },
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography
              sx={{ fontSize: '24px', lineHeight: '32px', textAlign: 'center' }}
              variant="h1"
            >
              Welcome to{' '}
              <Box component="span" sx={{ color: 'white', fontWeight: 'bold' }}>
                Surg Scan
              </Box>
            </Typography>
            <Typography align="center" variant="subtitle1">
              Automated Optical Inspection of Surgical Instruments | Sponsored by:
            </Typography>
          </Stack>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {/* <Box
              component="img"
              alt="Widgets"
              src="/assets/auth-widgets.png" // Optional, replace or remove if not needed
              sx={{ height: 'auto', width: '100%', maxWidth: '600px' }}
            /> */}
            <Box>
                <div className="sponsors">
                        <div className="sponsor-logo">
                            <img src={fast} alt="Sponsor 0" />
                        </div>
                        <div className="sponsor-logo">
                            <img src={logo} alt="Sponsor 1" />
                        </div>
                        <div className="sponsor-logo">
                            <img src={hecLogo} alt="Sponsor 2" />
                        </div>
                        <div className="sponsor-logo">
                            <img src={daddyDProLogo} alt="Sponsor 4" />
                        </div>
                        <div className="sponsor-logo">
                            <img src={drFrigzLogo} alt="Sponsor 3" />
                        </div>
                </div>
                {/* Surgical Instruments Section */}
                <div className="instruments">
                    <div className="instrument-item">
                        <img src={scissor} alt="Instrument 1" />
                    </div>
                    <div className="instrument-item">
                        <img src={forcep} alt="Instrument 1" />
                    </div>
                    <div className="instrument-item">
                        <img src={nailClipper} alt="Instrument 1" />
                    </div>
                </div>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
