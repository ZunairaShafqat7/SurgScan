import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BatchTable from './BatchTable';
import InstrumentDefectGraph from './InstrumentDefectGraph';
import DefectInstrumentGraph from './DefectInstrumentGraph';
import AddBatchForm from './AddBatchForm';
import Header from './header/header'; 
import UserSideNav from './sidebar/Sidebar';
import { Box, Grid } from '@mui/material';  
import { TotalBatches } from './totalBatches/totalBatches';
import { BatchCompletionProgress } from './totalBatches/batchProgress';
import { BatchInProgress } from './totalBatches/inprogress';
import { InstrumentStats } from './instrumentsGraph/instrumentsGraph';
import { DefectPieCharts } from './pieChart/pieChart';
import { DefectBarChart } from './instrumentsGraph/DefectBarChart';
import './UserDashboard.css';


const modalStyle = {
  position: 'fixed',
  top: '30%',
  left: '50%',
  transform: 'translate(-50%, -30%)',
  backgroundColor: '#fff',
  padding: '20px',
  boxShadow: '0 0 10px rgba(0,0,0,0.2)',
  zIndex: 9999,
  borderRadius: '10px',
  minWidth: '300px',
  textAlign: 'center'
};
const UserDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userDetails } = location.state || {};
  const [status, setStatus] = useState(userDetails?.status || '');
  const [batchDetails, setBatchDetails] = useState(userDetails?.batchDetails || []);
  const [display, setDisplay] = useState(userDetails?.batchDetails || []);
  const [userId, setUserId] = useState(userDetails?.id || '');
  const [userNumber, setUserNumber] = useState(userDetails?.number || '');
  const [userName, setUserName] = useState(userDetails?.name || '');
  const [userEmail, setUserEmail] = useState(userDetails?.email || '');
  const [pictureUrl, setPictureUrl] = useState(userDetails?.pictureUrl || '');
  const [message, setMessage] = useState('');
  const [cBatches, setCBatches] = useState(display.filter(batch => batch.status === 'complete').length || '');
  const [iPBatches, setIPBatches] = useState(display.filter(batch => batch.status === 'inprogress').length || '');

  const [completedBatches, setcompletedBatches] = useState(cBatches || '');
  const [inProgressBatches, setinProgressBatches] = useState(iPBatches || '');

  const [selectedBatch, setSelectedBatch] = useState(null);

  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredBatches, setFilteredBatches] = useState([]);

//   useEffect(() => {
//   const afterPrint = () => {
//     setFilteredBatches([]);
//     setDisplay(batchDetails);
//     setcompletedBatches(display.filter(batch => batch.status === 'complete').length );
//     setinProgressBatches(display.filter(batch => batch.status === 'inprogress').length);
//     console.log("completed length after filter: ",batchDetails.filter(batch => batch.status === 'complete').length)
//   }
//   window.addEventListener('afterprint', afterPrint);
//   return () => window.removeEventListener('afterprint', afterPrint);
// }, []);


useEffect(() => {
  const afterPrint = () => {
    if (!batchDetails || !Array.isArray(batchDetails)) {
      setFilteredBatches([]);
      setDisplay([]);
      setcompletedBatches(0);
      setinProgressBatches(0);
      return;
    }

    // Restore to the latest batchDetails
    setFilteredBatches([]);
    setDisplay(batchDetails);
    setcompletedBatches(batchDetails.filter(batch => batch.status === 'complete').length);
    setinProgressBatches(batchDetails.filter(batch => batch.status === 'inprogress').length);
    console.log("Restored completedBatches:", batchDetails.filter(batch => batch.status === 'complete').length);
  };

  window.addEventListener('afterprint', afterPrint);
  return () => window.removeEventListener('afterprint', afterPrint);
}, [batchDetails]);



  
  const handleAddBatch = (newBatch) => {
    setBatchDetails(prevDetails => [...prevDetails, newBatch]);
    console.log("New Batch:" , newBatch)
  };

  const handleRowClick = (batch) => {
  setSelectedBatch(batch);
  };

  const HandleInspection = (batch) => {

    const now = new Date();
    // Format date as 'YYYY-MM-DD'
    const date = now.toISOString().split('T')[0];
    // Format time as 'HH:MM:SS'
    const time = now.toTimeString().split(' ')[0];

    navigate('/inspection/', {
      state: {
        name: userName,
        id: userId,
        batch: batch.batch_number,
        date: date,
        time: time
      }
    });
  };




  // Safely transform batchDetails to match sampleDataa structure
function transformBatchData(batchDetails) {
  if (!Array.isArray(batchDetails)) return [];

  return batchDetails.map(batch => ({
    batch_number: batch.batch_number || 'Unknown Batch',
    instruments: (batch.instruments || []).map(instrument => ({
      instrument_name: instrument.instrument_name || 'Unnamed Instrument',
      defects: (instrument.defects || []).map(defect => ({
        defect_name: defect.defect_name || 'Unknown Defect',
        count: defect.count || 0
      }))
    }))
  }));
}

// Use transformed data if available, else fallback to hardcoded sample
const transformedBatchData = transformBatchData(display);
const validBatchData = transformedBatchData//.length > 0 ? transformedBatchData : sampleDataa;
const handleProfileClick = () => {
  navigate('/account', {
    state: {
      uname: userName,
      uid: userId,
      uemail: userEmail,
      ustatus: status,
      unumber: userNumber,
      upictureUrl: pictureUrl,
    },
  });
};


  const handleLogout = () => {
    navigate('/');
  };
  

  // const handlePrint = () => {
  //   window.print(); // No DOM manipulation!
  // };
  const handlePrint = () => {
  setShowPrintOptions(true);  // Show the print dialog options
};



  const onHomeRedirect = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const { name, id } = location.state || {};
    // console.log(name, id);
    try {
      const response = await fetch('/api/dashboard/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName,userId }), // Send the email and password in the request body
      });
  
      const data = await response.json(); // Parse the response as JSON
  
      if (response.ok) {
        setMessage(data.message);
        

        // Navigate with state
        if (data.status === 'admin') {
          const userDetails = {
            name: data.name,
            id: data.id,
            email: data.email,
            number: data.number,
            status: data.status,
            pictureUrl: data.picture_url,
            date: data.created_at_date,
            time: data.created_at_time,
            batchDetails: data.batch_details,
          };
          navigate('/admin-dashboard/', { state: { userDetails } });
        } else if (data.status === 'user') {
          const userDetails = {
            name: data.name,
            id: data.id,
            email: data.email,
            number: data.number,
            status: data.status,
            pictureUrl: data.picture_url,
            date: data.created_at_date,
            time: data.created_at_time,
            batchDetails: data.batch_details,
          };
          navigate('/user-dashboard/', { state: { userDetails } });
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred.');
    }
  };

const handleStatusUpdate = async (batchNumber) => {
  try {
    const response = await fetch('/api/get-updated-batch-details/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, userId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Update batch statistics
    // setcompletedBatches(data.completed_count);
    // setinProgressBatches(data.inprogress_count);
    console.log("batch details before:", batchDetails)
    const updatedBatchDetails = batchDetails.map(batch =>
      batch.batch_number === batchNumber
        ? { ...batch, status: batch.status === 'complete' ? 'inprogress' : 'complete' }
        : batch
    );
    // Update batchDetails for the specific batch
    setBatchDetails(updatedBatchDetails);
    console.log("batch details after:", batchDetails)
    console.log("Updated batch details after:", updatedBatchDetails)
    setDisplay(updatedBatchDetails);

    const completedCount = updatedBatchDetails.filter(batch => batch.status === 'complete').length;
    const inProgressCount = updatedBatchDetails.filter(batch => batch.status === 'inprogress').length;

    setcompletedBatches(completedCount);
    setinProgressBatches(inProgressCount);

  } catch (error) {
    console.error("Failed to fetch stats:", error);
    setMessage('An error occurred while fetching stats.');
  }
};
useEffect(() => {
  console.log("Updated batchDetails:", batchDetails);
}, [batchDetails]);
  // const handleStatusUpdate = async (batchNumber) => {
  //   try {
  //         const response = await fetch('/api/get-updated-batch-details/', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ status ,userId }),
  //         });

  //         if (!response.ok) {
  //             throw new Error(`HTTP error! Status: ${response.status}`);
  //         }

  //         const data = await response.json();
  //         setcompletedBatches(data.completed_count);
  //         setinProgressBatches(data.inprogress_count);

  //     } catch (error) {
  //         console.error("Failed to fetch stats:", error);
  //         setMessage('An error occurred while fetching stats.');
  //     }
  // };
  

  const handleManageUsers = async () => {
      try {
          const response = await fetch('/admini/get-users/', {
              method: 'GET',  // Use 'POST' if your API requires it
              headers: {
                  'Content-Type': 'application/json',  // Adjust headers if necessary
                  // Add any other headers if required, such as Authorization
              },
              // body: formData,  // Uncomment this if your endpoint expects a body
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const data = await response.json();
          const { id , name , total_batches,status } = data;
          navigate('/admini/manage-users', { state: { id , name , total_batches,status, userEmail, userId, userName} });
      } catch (error) {
          console.error("Failed to fetch stats:", error);
          setMessage('An error occurred while fetching stats.');
      }
  };
    useEffect(() => {}, [userDetails]);
  


  return (
    <Box sx={{ display: 'flex', backgroundColor: 'white', minHeight: '100vh' }}>
      <div className="no-print">
        <UserSideNav status={status} onLogout={handleLogout} onProfileClick={handleProfileClick} onHomeRedirect={onHomeRedirect} OnManageUsers={handleManageUsers} state={"home"}  /> {/* Sidebar */}
      </div>
      <Box sx={{ flexGrow: 1, ml: '240px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="no-print">
          <Box>
            <Header
              title={status === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}
              pictureUrl={pictureUrl}
              userName={userName}
              onPrint={handlePrint}
            />
          </Box>
        </div>
<div id="printable-content">
        {/* Dashboard content */}

        <Box sx={{ flexGrow: 1, p: 3 }}>
          {/* Small space between sidebar and card */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <BatchCompletionProgress 
                completedBatches={completedBatches}
                totalBatches={display.length}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <BatchInProgress 
                inProgressBatches={inProgressBatches}
                totalBatches={display.length}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <TotalBatches totalBatches={display.length} />
            </Grid>
          </Grid>

          {/* <div style={{ display: 'flex', marginTop: '40px', gap: '40px' }}> */}
            <div style={{ marginTop: '40px' }}>
              <InstrumentStats defectData={validBatchData} />
            </div>

            <div style={{ marginTop: '40px' }}>
              <DefectPieCharts defectData={validBatchData} />
            </div>


          {selectedBatch && (
            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '80%', maxWidth: '800px', textAlign: 'center' }}>
                <h2>Graph for Batch: {selectedBatch.batch_number}</h2>
                <br />
                {/* Batch Info Table */}
                <div style={{ marginBottom: '20px', textAlign: 'left', lineHeight: '1.8', color: '#333' }}>
                  <p><strong>Instrument:</strong> {selectedBatch.instrument}</p>
                  <p><strong>Total Images Inspected:</strong> {selectedBatch.total_images_inspected}</p>
                  <p><strong>Total Defected Images:</strong> {selectedBatch.total_defected_images}</p>
                  <p><strong>Total Non-Defected Images:</strong> {selectedBatch.total_non_defected_images}</p>
                  <p><strong>Status:</strong> {selectedBatch.status}</p>
                  <p><strong>Created At:</strong> {new Date(selectedBatch.created_at).toLocaleString()}</p>
                </div>
                <br />
                <DefectBarChart defectData={[selectedBatch]} />
                
                <div style={{ marginTop: '20px' }}>
                  <button onClick={() => setSelectedBatch(null)}>Close Graph</button>
                </div>
              </div>
            </div>
          )}

          {/* Other dashboard content */}
          <Box className="dashboard-content" sx={{ mt: 4 }}>
          {/* <BatchTable batchDetails={batchDetails} onRowClick={handleRowClick} OnHandleInspection={HandleInspection} onStatusUpdate={handleStatusUpdate} /> onStatusChange={changeBatchStatus} */}
          <BatchTable batchDetails={filteredBatches.length > 0 ? filteredBatches : batchDetails} onRowClick={handleRowClick} OnHandleInspection={HandleInspection} onStatusUpdate={handleStatusUpdate}/>

            <div className="add-batch-form" id="add-batch-form" style={{ marginTop: '40px' }}>
              <AddBatchForm userId={userId} userEmail={userEmail} userName={userName} onAddBatch={handleAddBatch} />
            </div>
          </Box>
        </Box>
        </div>


        {showPrintOptions && (
  <div className="modal no-print" style={modalStyle}>
    <h3>Select Print Option</h3>
    <div style={{ marginTop: '10px' }}>
      <button onClick={() => {
        setShowPrintOptions(false);
        window.print();  // Print all data
      }}>
        Print All
      </button>
      &nbsp;&nbsp;
      <button onClick={() => {
        setShowPrintOptions(false);
        setShowDatePicker(true);  // Show date selection form
      }}>
        Select Date Range
      </button>
      &nbsp;&nbsp;
      <button onClick={() => setShowPrintOptions(false)}>Cancel</button>
    </div>
  </div>
)}





{showDatePicker && (
  <div className="modal no-print" style={modalStyle}>
    <h3>Select Start and End Date</h3>
    <div style={{ marginTop: '10px' }}>
      <label>
        Start Date:&nbsp;
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </label>
      <br /><br />
      <label>
        End Date:&nbsp;
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </label>
      <br /><br />
      <button onClick={() => {
        if (!startDate || !endDate) {
          alert('Please select both start and end dates.');
          return;
        }
        const start = new Date(startDate);
        console.log("start" , start)
        const end = new Date(endDate);
        // end.setHours(23, 59, 59);

        const filtered = batchDetails.filter(batch => {
          // const created = new Date(batch.created_at);
          const created = new Date(batch.created_at.replace(' ', 'T'));
          if (created >= start && created <= end){
          }
          return created >= start && created <= end;
        });
        setFilteredBatches(filtered);
        setDisplay(filtered);
        setcompletedBatches(filtered.filter(batch => batch.status === 'complete').length );
        setinProgressBatches(filtered.filter(batch => batch.status === 'inprogress').length);
        setShowDatePicker(false);
        setTimeout(() => window.print(), 1000);  // print after filtered content renders
      }}>
        Print Filtered
      </button>
      &nbsp;&nbsp;
      <button onClick={() => setShowDatePicker(false)}>Cancel</button>
    </div>
  </div>
)}




      </Box>
    </Box>
  );
};

export default UserDashboard;
