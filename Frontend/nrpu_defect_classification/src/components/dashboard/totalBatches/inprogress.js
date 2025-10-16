import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { HourglassEmpty as HourglassEmptyIcon } from '@mui/icons-material'; // MUI icon for 'in-progress'

export function BatchInProgress({ inProgressBatches, totalBatches }) {
  const inProgressPercentage = totalBatches > 0 ? (inProgressBatches / totalBatches) * 100 : 0;

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
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" gutterBottom variant="overline">
                Batches In Progress
              </Typography>
              <Typography variant="h4">{Math.round(inProgressPercentage)}%</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-warning-main)', height: '56px', width: '56px' }}>
              <HourglassEmptyIcon fontSize="large" />
            </Avatar>
          </Stack>
          <div>
            <LinearProgress value={inProgressPercentage} variant="determinate" />
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
