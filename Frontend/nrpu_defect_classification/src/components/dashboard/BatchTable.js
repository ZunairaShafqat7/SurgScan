import React, { useState, useEffect } from 'react';
import './BatchTable.css';

const BatchTable = ({ batchDetails, onRowClick, OnHandleInspection, onStatusUpdate }) => {
  const [batches, setBatches] = useState(batchDetails);

  useEffect(() => {
    setBatches(batchDetails);
  }, [batchDetails]);

  const handleStatusToggle = async (event, batch_number, currentStatus, index) => {
    event.stopPropagation(); // Prevent row click

    const newStatus = currentStatus === 'inprogress' ? 'complete' : 'inprogress';
    console.log(batch_number)
    try {
      const encodedBatchNumber = encodeURIComponent(batch_number);
      const response = await fetch(`/api/update-batch-status/${encodedBatchNumber}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedBatches = [...batches];
      updatedBatches[index] = {
        ...updatedBatches[index],
        status: newStatus,
      };
      setBatches(updatedBatches);

      if (onStatusUpdate) {
        onStatusUpdate(batch_number); // Trigger parent callback
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <table className="batch-table">
      <thead>
        <tr>
          <th>Batch No</th>
          <th>Instrument</th>
          <th>Total Images</th>
          <th>Status</th>
          <th>Action</th>
          <th>Inspection</th>
        </tr>
      </thead>
      <tbody>
        {batches.map((batch, index) => (
            <tr key={index} onClick={() => onRowClick(batch)}>
            <td>{batch.batch_number}</td>
            <td>{batch.instruments[0]?.instrument_name || 'N/A'}</td>
            <td>{batch.total_images_inspected}</td>
            <td>{batch.status}</td>
            <td>
              <button
                onClick={(e) =>
                  handleStatusToggle(e, batch.batch_number, batch.status, index)
                }
              >
                Toggle Status
              </button>
            </td>
            <td>
              <button
                onClick={() =>
                  OnHandleInspection(batch)
                }
              >
                Inspect
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BatchTable;
