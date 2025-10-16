'use client';

import React, { useEffect,useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import { useNavigate  } from 'react-router-dom';

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
];

export function AccountDetailsForm({ id , name, email, number }) {
  const [Id, setId] = useState(id || '');
  const [Name, setName] = useState(name || '');
  const [Email, setEmail] = useState(email || '');
  const [Number, setNumber] = useState(number || '');
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/');
  };
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      {/* The information can be edited */}
      <Card>
        <CardHeader subheader="---" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
          <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>ID</InputLabel>
                <OutlinedInput defaultValue={id} label="ID" name="ID" />
                {/* <OutlinedInput
                            id="id"
                            type="number"
                            value={Id}
                            onChange={(e) => setId(e.target.value)}
                            label="ID"
                            name="ID"
                  /> */}
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Name</InputLabel>
                <OutlinedInput defaultValue={name} label="Name" name="firstName" />
                {/* <OutlinedInput
                            id="name"
                            type="text"
                            value={Name}
                            onChange={(e) => setName(e.target.value)}
                            label="Name"
                /> */}
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput defaultValue={email} label="Email address" name="email" />
                {/* <OutlinedInput
                            id="email"
                            type="email"
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email Address"
                  /> */}
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput defaultValue={number} label="Phone number" name="Phone number" />
                {/* <OutlinedInput
                            id="number"
                            type="number"
                            value={Number}
                            onChange={(e) => setNumber(e.target.value)}
                            label="Phone number"
                /> */}
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button onClick={handleLogout} variant="contained">Logout</Button>
        </CardActions>
      </Card>
    </form>
  );
}
