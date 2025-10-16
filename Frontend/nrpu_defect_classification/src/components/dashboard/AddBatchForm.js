import React, { useState } from 'react';
import {
  TextField, Button, Alert, Box, Typography, Select, MenuItem,
  InputLabel, FormControl
} from '@mui/material';

const AddBatchForm = ({ userId, userName, userEmail, onAddBatch }) => {
  const [instrument, setInstrument] = useState('');
  const [details, setDetails] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const instrumentOptions = [
    'Bandage Scissor',
    'Carver',
    'Dressing Forcep',
    'Ex-probe',
    'Mcindoe Forcep',
    'Nail Clipper',
    'Probe',
    'Scalpal',
    'Scissor',
    'Teale Vulsellum Forceps',
    'Uterine Curette'
  ];

  const handleAddBatch = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', userEmail);
    formData.append('instrument', instrument);
    formData.append('details', details);

    fetch('/api/add-batch/', {
      method: 'POST',
      body: formData,
    })    
      .then(response => response.json())
      .then(data => {
        setMessage(data.message);
        setError(false);


        console.log("<<<<<",data.batch_number,instrument)
        onAddBatch({
          batch_number: data.batch_number,
          status: 'inprogress',
          instrument: instrument,
          instruments: [
            {
              instrument_name: instrument,
              total_defected: 0,
              total_undefected: 0,
              defects: []
            }
          ],
          total_images_inspected: 0,
          total_defected_images: 0,
          total_non_defected_images: 0
        });
        

        


        setInstrument('');
        setDetails('');
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage('An error occurred.');
        setError(true);
      });
  };
  

  return (
    <Box sx={{
      maxWidth: 500,
      margin: '0 auto',
      padding: 4,
      backgroundColor: '#f5f5f5',
      borderRadius: 2,
      boxShadow: 3,
    }}>
      <Typography variant="h5" align="center" gutterBottom>
        Add New Batch
      </Typography>

      <form onSubmit={handleAddBatch}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="instrument-label">Instrument</InputLabel>
          <Select
            labelId="instrument-label"
            value={instrument}
            label="Instrument"
            onChange={(e) => setInstrument(e.target.value)}
          >
            {instrumentOptions.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Details"
          variant="outlined"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          multiline
          rows={4}
          margin="normal"
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Add Batch
        </Button>
      </form>

      {message && (
        <Alert severity={error ? 'error' : 'success'} sx={{ mt: 3 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
};

export default AddBatchForm;
