import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material'; // Using MUI icon for completion

export function BatchCompletionProgress({ completedBatches, totalBatches }) {
  const completionPercentage = totalBatches > 0 ? (completedBatches / totalBatches) * 100 : 0;

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
                Batches Completed
              </Typography>
              <Typography variant="h4">{Math.round(completionPercentage)}%</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-success-main)', height: '56px', width: '56px' }}>
              <CheckCircleIcon fontSize="large" />
            </Avatar>
          </Stack>
          <div>
            <LinearProgress value={completionPercentage} variant="determinate" />
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
