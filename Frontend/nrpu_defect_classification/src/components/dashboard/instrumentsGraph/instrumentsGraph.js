import React from 'react';
import './InstrumentGraph.css';  // ← import the CSS
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardHeader } from '@mui/material';
const defectColors = {
  Crack: '#0f4c81',
  Scratch: '#0077b6',
  Cuts: '#00b4d8',
  Pores: '#90e0ef',
  Corrosion: '#6930c3',
  Undefected: '#48cae4'
};
export function InstrumentStats({ defectData }) {
const instrumentMap = {};

defectData.forEach(batch => {
  batch.instruments.forEach(instrument => {
    const name = instrument.instrument_name;
    if (!instrumentMap[name]) {
      instrumentMap[name] = {};
    }

    instrument.defects.forEach(defect => {
      if (!instrumentMap[name][defect.defect_name]) {
        instrumentMap[name][defect.defect_name] = 0;
      }
      instrumentMap[name][defect.defect_name] += defect.count;
    });
  });
});

// Step 2: Convert aggregated map to chartData array
const chartData = Object.entries(instrumentMap).map(([instrument, defects]) => ({
  instrument,
  ...defects,
}));


  const defectNames = [
    ...new Set(
      chartData.flatMap(item => Object.keys(item).filter(key => key !== 'instrument'))
    )
  ];

  return (
    <div className="chart-container">
    <h3 style={{ marginBottom: '10px', color: 'black' }}>Instruments</h3>
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="instrument"
          angle={-30}
          textAnchor="end"
          interval={0}
          height={100}
        />
        <YAxis />
        <Tooltip />
        {defectNames.map(defect => (
          <Bar
            key={defect}
            dataKey={defect}
            fill={defectColors[defect] || '#8884d8'}
            name={defect}
            stackId="defects"
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  
    {/* Custom Legend */}
    <div style={{ marginTop: '10px' }}>
      {defectNames.map((defect, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: defectColors[defect] || '#8884d8',
              marginRight: '8px',
              borderRadius: '2px',
            }}
          />
          <span style={{ fontSize: '14px', color: '#333' }}>{defect}</span>
        </div>
      ))}
    </div>
  </div>
  
  );
}
