import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const InstrumentDefectGraph = ({ batchDetails }) => {
  const instrumentData = batchDetails.map(batch => ({
    batchNo: batch.batch_number,
    defects: batch.total_defected_images,
  }));

  const data = {
    labels: instrumentData.map(d => d.batchNo),
    datasets: [
      {
        label: 'Defected Images per Instrument',
        backgroundColor: '#224287',
        data: instrumentData.map(d => d.defects),
      }
    ],
  };

  return (
    <div className="graph">
      <h3>Instrument Defects</h3>
      <Bar data={data} />
    </div>
  );
};

export default InstrumentDefectGraph;
