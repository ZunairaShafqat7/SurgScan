import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { Box, Typography } from '@mui/material';
import './pieChart.css'

// Predefined colors for pie slices
const pieColors = [
  '#1e3a8a', // Deep Navy Blue
  '#1b9181', // Bright Blue
  '#7dd3fc', // Light Sky Blue
  '#7c7c7c', // Pale Blue
  '#cc37c5', // Light Grey
  '#c2a91a', // Medium Grey
  '#e714b2'  // Darker Grey (but still neutral)
];

export function DefectPieCharts({ defectData }) {

  const aggregatedData = {};

// Combine all instrument data across batches
defectData.forEach(batch => {
  batch.instruments.forEach(instrument => {
    const instrumentName = instrument.instrument_name;

    if (!aggregatedData[instrumentName]) {
      aggregatedData[instrumentName] = {};
    }

    instrument.defects.forEach(defect => {
      if (!aggregatedData[instrumentName][defect.defect_name]) {
        aggregatedData[instrumentName][defect.defect_name] = 0;
      }
      aggregatedData[instrumentName][defect.defect_name] += defect.count;
    });
  });
});

// Extract unique defect names
const defectNames = [
  ...new Set(
    Object.values(aggregatedData).flatMap(defects => Object.keys(defects))
  ),
];

// Format pie chart data per defect
const pieChartData = defectNames.map(defectName => {
  const instrumentData = Object.entries(aggregatedData)
    .filter(([_, defects]) => defects[defectName])
    .map(([instrumentName, defects]) => ({
      name: instrumentName,
      value: defects[defectName],
    }));

  return {
    defectName,
    data: instrumentData,
  };
});


  return (
    <div className="chart-container">
      <h3 style={{ marginBottom: '10px', color: 'black' }}>Defect Distribution</h3>
      <div className='inner-container'>
      {pieChartData.map((defect, index) => (
        <Box
        key={defect.defectName}
        sx={{
          width: 300,
          height: 'auto',
          margin: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '16px',
          boxSizing: 'border-box',
          transition: '0.3s',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            borderColor: '#999',
          },
        }}
      >
        <Typography variant="h6" sx={{ color: 'black', marginBottom: '10px', textAlign: 'center' }}>
          {defect.defectName}
        </Typography>
        <br></br>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={defect.data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {defect.data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={pieColors[idx % pieColors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      
        {/* Legend */}
        <div style={{ marginTop: '10px' }}>
          {defect.data.map((entry, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: pieColors[idx % pieColors.length],
                  marginRight: '8px',
                  borderRadius: '2px',
                }}
              />
              <Typography variant="body2" color="textSecondary">
                {entry.name}
              </Typography>
            </div>
          ))}
        </div>
      </Box>
      
      ))}
      </div>
    </div>
  );
}
