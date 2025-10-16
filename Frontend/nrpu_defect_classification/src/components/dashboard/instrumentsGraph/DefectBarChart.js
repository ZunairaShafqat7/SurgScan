import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export function DefectBarChart({ defectData }) {
  const batch = defectData[0]; // Since you only send one selectedBatch
  const defectCountMap = {};

  batch.instruments.forEach(instrument => {
    instrument.defects.forEach(defect => {
      if (!defectCountMap[defect.defect_name]) {
        defectCountMap[defect.defect_name] = 0;
      }
      defectCountMap[defect.defect_name] += defect.count;
    });
  });

  const barData = Object.entries(defectCountMap).map(([defect_name, count]) => ({
    defect: defect_name,
    count: count
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="defect" />
        <YAxis />
        <Tooltip />
        {/* <Legend /> */}
        <Bar dataKey="count" fill="#1e3a8a" />
      </BarChart>
    </ResponsiveContainer>
  );
}
