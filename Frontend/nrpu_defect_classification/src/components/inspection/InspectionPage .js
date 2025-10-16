import React, { useState } from 'react';
import './InspectionPage.css'; 
import placeholderImage from '../../assets/image-placeholder.png';
import LiveCapture from '../live/live';
// import LiveCapture from '../live/liveupdated';
import { useNavigate, useLocation } from 'react-router-dom';

const InspectionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, id, batch, date, time } = location.state || {};
  const [stamp, setStamp] = useState(date || '2025-5-10');
  const [timetaken, setTimeTaken] = useState(time || '2:30 PM');
  const [instrument, setInstrument] = useState('No Instrument');//No Instrument
  const [defect, setDefect] = useState('No Defect');//No Defect
  const [status, setStatus] = useState('Inspection in Progress');//Inspection in Progress
  const [confidence, setConfidence] = useState('Inspection in Progress');
  const [message, setMessage] = useState('');
  const [statusColor, setStatusColor] = useState('#B0C4DE');
  const [capturedImage, setCapturedImage] = useState(null); // Store the captured image

  console.log(name, id, batch, date, time)

  // This function will be called when an image is captured in LiveCapture component
  const handleImageCapture = (imageData) => {
    setCapturedImage(imageData); // Store the captured image
  };
  // const dataURLtoBlob = (dataURL) => {
  //   const byteString = atob(dataURL.split(',')[1]);
  //   const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  //   const ab = new ArrayBuffer(byteString.length);
  //   const ia = new Uint8Array(ab);
  //   for (let i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  //   return new Blob([ab], { type: mimeString });
  // };
  const dataURLtoBlob = (dataURL) => {
    const binary = atob(dataURL.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  };
  
  const handleInspectImage = async () => {
    if (capturedImage) {
      setStatus('Inspecting');
      setStatusColor('blue');
      try {
        const formData = new FormData();
        const blob = dataURLtoBlob(capturedImage);
        formData.append('image', blob);  // Ensure this data is in the correct format
        formData.append('batch', batch);
        formData.append('name', name);
        formData.append('id', id);

        const response = await fetch('/api/inspect-image/', { 
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          setConfidence(result.message)
          setDefect(result.defect)
          setInstrument(result.instrument)
          // 
          setStamp(result.date)
          setTimeTaken(result.time)

          console.log('Image inspected successfully:', result);
          setStatus('Inspection Completed'); 
          setStatusColor('green');
        } else {
          console.error('Error inspecting image:', response.statusText);
          setStatus('Inspection Failed');
          setStatusColor('red');
        }
      } catch (error) {
        console.error('Error sending image to backend:', error);
        setStatus('Inspection Failed');
        setStatusColor('red');
      }
    } else {
      console.error('No image captured!');
      setStatus('No image captured for inspection');
      setStatusColor('red');
    }
  };





  const handleLogout = () => {
    // Redirect to the login page
    navigate('/'); // Replace '/login' with your login route
  };
    const handleProfileRedirect = async (event) => {
    event.preventDefault(); // Prevent the default form submission
    const { name, id } = location.state || {};
    // console.log(name, id);
    try {
      const response = await fetch('/api/dashboard/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name,id }), // Send the email and password in the request body
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
  






  const handleStatsRedirect = async (event) => {
    // isValidElement.preventDefault();
    const { name, id } = location.state || {};
    // console.log(name, id,"here");
    try {
      const response = await fetch('/api/stats/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name,id }), // Send the email and password in the request body
      });
  
      const data = await response.json(); // Parse the response as JSON
  
      if (response.ok) {
              console.log(data.message)
              // Navigate to the stats page and pass the batch details in state
              navigate('/stats', { state: { batches: data.batches } }); // Pass entire batch data
          } else {
              setMessage(data.message); // Display the error message
          }
      } catch (error) {
          console.error('Error:', error);
          setMessage('An error occurred.');
      }
  };



  return (
    <div className='inspection-Wrapper'>
      <div className="header_inspection">
        <div className="header__bar">
          <h2 className="header__title">Surg Scan</h2>
          
          <button className="header__button" onClick={handleLogout}>LogOut</button>
        </div>
      </div>

      <div className="container_inspection">
        <div className="container__side-by-side">
          <div className="container__left" style={{ padding: 'auto' }}>
            <h4 style={{ textAlign: 'center', fontSize: 'large', marginBottom: '10px' }}>Results</h4>
            <div className="mini_inspection">
              <div className="mini__left">Date:</div>
              <div className="mini__right">{stamp}</div>
            </div>
            <div className="mini_inspection">
              <div className="mini__left">Time:</div>
              <div className="mini__right">{timetaken}</div>
            </div>
            <div className="mini_inspection">
              <div className="mini__left">Batch No:</div>
              <div className="mini__right">{batch}</div>
            </div>
            <div className="mini_inspection">
              <div className="mini__left">Instrument:</div>
              <div className="mini__right">{instrument}</div>
            </div>
            <div className="mini_inspection">
              <div className="mini__left">Defect:</div>
              <div className="mini__right">{defect}</div>
            </div>
            <div className="mini_inspection">
              <div className="mini__left">Comments:</div>
              <div className="mini__right">{confidence}</div>
            </div>
          </div>

          <div className="container__right">
            <LiveCapture onCapture={handleImageCapture} /> {/* Pass onCapture to LiveCapture */}
          </div>
        </div>

        <br />

        <div className="container__side-by-side">
          <div className="container_left_">
            {/* <button className="button" onClick={handleStatsRedirect}>Stats</button> */}
            <button className="button" onClick={handleProfileRedirect}>Dashboard</button>
          </div>

          <div className="prompt_container" style={{ backgroundColor: statusColor }}>
            <h2 style={{ backgroundColor: statusColor }}>{status}</h2>
          </div>
        </div>

        <br /><br />
        <input type="submit" className="button_inspection" id="submit-btn" value="Inspect Image" onClick={handleInspectImage} />
      </div>
    </div>
  );
};

export default InspectionPage;
