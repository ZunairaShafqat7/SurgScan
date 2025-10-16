import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DefectInstrumentGraph = ({ batchDetails }) => {
  const defectCounts = batchDetails.reduce((acc, batch) => {
    acc[batch.batch_number] = batch.total_defected_images;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(defectCounts),
    datasets: [
      {
        label: 'Defects by Instrument',
        backgroundColor: ['#224287', '#4B91F1', '#72A8FF', '#A3C0FF'],
        data: Object.values(defectCounts),
      },
    ],
  };

  return (
    <div className="graph">
      <h3>Defects by Instrument</h3>
      <Pie data={data} />
    </div>
  );
};

export default DefectInstrumentGraph;
