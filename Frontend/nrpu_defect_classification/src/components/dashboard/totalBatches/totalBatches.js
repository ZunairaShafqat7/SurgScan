import React from 'react';
import { Card, CardContent, Typography, Stack, Avatar } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'; // icon for batches

export function TotalBatches({ totalBatches }) {
  return (
    <Card 
    sx={{
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          borderColor: '#999',
        },
      }}
      >
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Total Batches
              </Typography>
              <Typography variant="h4">{totalBatches}</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'primary.main', height: 56, width: 56 }}>
              <Inventory2OutlinedIcon fontSize="large" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
