import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './AdminStatsPage.css'; // Import the CSS file
import { Bar } from 'react-chartjs-2'; // Import the Bar chart component
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register the components needed for the Bar chart
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminStatsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { batches = [] } = location.state || {};  // Retrieve batches from navigation state
    const [selectedBatch, setSelectedBatch] = useState(null); // State to hold the selected batch for the graph

    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    const handleBatchClick = (batch) => {
        setSelectedBatch(batch); // Set the selected batch to show the graph
    };

    // If a batch is selected, generate the graph data
    const graphData = selectedBatch ? {
        labels: ['Total Images Inspected', 'Total Defected Images', 'Total Non-Defected Images'],
        datasets: [
            {
                label: 'Images Inspected',
                data: [
                    selectedBatch.total_images_inspected,
                    selectedBatch.total_defected_images,
                    selectedBatch.total_non_defected_images
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', // Color for Total Images Inspected
                    'rgba(255, 99, 132, 0.6)', // Color for Defected Images
                    'rgba(153, 102, 255, 0.6)' // Color for Non-Defected Images
                ],
            },
        ],
    } : null;  // Only generate the graph data if a batch is selected

    return (
        <div className="admin-stats">
            <div className="astat-top-bar">
                <h1 className="astat-title">Admin Stats</h1>
                <button onClick={handleBack} className="back-button">Back</button>
            </div>

            <h2>Batches</h2>
            <table>
                <thead>
                    <tr>
                        <th>Batch No</th>
                        <th>Total Images Inspected</th>
                        <th>Total Defected Images</th>
                        <th>Total Non-Defected Images</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {batches && batches.length > 0 ? (
                        batches.map(batch => (
                            <tr key={batch.batch_number} onClick={() => handleBatchClick(batch)}>
                                <td>{batch.batch_number}</td>
                                <td>{batch.total_images_inspected}</td>
                                <td>{batch.total_defected_images}</td>
                                <td>{batch.total_non_defected_images}</td>
                                <td>{batch.details}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No batches found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Conditionally render the graph if a batch is selected */}
            {selectedBatch && (
                <div className="graph-container">
                    <h2>Inspection Statistics for Batch {selectedBatch.batch_number}</h2>
                    <Bar data={graphData} />
                </div>
            )}
        </div>
    );
};

export default AdminStatsPage;





{/* <h2>Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.number}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table> */}