// import React, { useRef, useState } from 'react';

// const LiveCapture = ({ onCapture }) => {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [image, setImage] = useState(null);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;
//     } catch (err) {
//       console.error("Error accessing camera:", err);
//     }
//   };

//   const captureImage = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const context = canvas.getContext('2d');
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const imageData = canvas.toDataURL('image/png');
//     setImage(imageData);

//     // Stop the camera stream
//     const stream = video.srcObject;
//     const tracks = stream.getTracks();
//     tracks.forEach(track => track.stop());
//     video.srcObject = null;

//     // Call the parent callback function
//     if (onCapture) {
//       onCapture(imageData);
//     }
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <button onClick={startCamera} style={{ marginRight: '10px' }}>
//         Live Capture
//       </button>
//       <button onClick={captureImage}>Capture</button>

//       <video ref={videoRef} autoPlay style={{ display: image ? 'none' : 'block', marginTop: '20px' }}></video>
//       <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

//       {image && (
//         <div style={{ marginTop: '20px' }}>
//           <h2>Captured Image</h2>
//           <img src={image} alt="Captured" style={{ maxWidth: '100%', height: 'auto' }} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default LiveCapture;





import React, { useRef, useEffect } from 'react';

const LiveCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start the camera automatically when the component mounts
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startCamera();

    // Cleanup: Stop the camera when the component unmounts
    return () => {
      const stream = videoRef.current?.srcObject;
      const tracks = stream?.getTracks();
      tracks?.forEach((track) => track.stop());
    };
  }, []);


const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    console.log(canvas,video)
    // const targetWidth = 4002;
    // const targetHeight = 2668;
    const targetWidth = 1600;
    const targetHeight = 1600;
    
    // Set canvas size
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    const context = canvas.getContext('2d');
    
    // Get the aspect ratio of the video
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const videoAspectRatio = videoWidth / videoHeight;
    
    const canvasAspectRatio = targetWidth / targetHeight;
  
    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (videoAspectRatio > canvasAspectRatio) {
      // Video is wider than canvas, crop width
      drawHeight = targetHeight;
      drawWidth = videoWidth * (targetHeight / videoHeight);
      offsetX = -(drawWidth - targetWidth) / 2;  // Center the video horizontally
      offsetY = 0;
    } else {
      // Video is taller than canvas, crop height
      drawWidth = targetWidth;
      drawHeight = videoHeight * (targetWidth / videoWidth);
      offsetX = 0;
      offsetY = -(drawHeight - targetHeight) / 2;  // Center the video vertically
    }
    
    // Draw the video feed on the canvas, centered and cropped
    context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
  
    const imageData = canvas.toDataURL('image/jpg',1.0);
    
    // Call the parent callback function to pass the image
    if (onCapture) {
      onCapture(imageData);
    }
  };

// const captureImage = () => {
//   const canvas = canvasRef.current;
//   const video = videoRef.current;
//   console.log(video ,"Canvas: ",canvas)
  
//   // Set canvas size to the video size (no resizing)
//   const videoWidth = video.videoWidth;
//   const videoHeight = video.videoHeight;

//   canvas.width = videoWidth;
//   canvas.height = videoHeight;

//   const context = canvas.getContext('2d');
  
//   // Draw the video frame directly on the canvas without resizing or cropping
//   context.drawImage(video, 0, 0, videoWidth, videoHeight);

//   // Get the image as a data URL
//   const imageData = canvas.toDataURL('image/jpg');
  
//   // Call the parent callback function to pass the image
//   if (onCapture) {
//       onCapture(imageData);
//   }
// };
  
  return (
    <div style={{ textAlign: 'center' }}>
      {/* Live video stream */}
      <video
        ref={videoRef}
        style={{ maxWidth: '100%', height: '100%' }}
        autoPlay
      ></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      <div>
        <button onClick={captureImage}>Capture Image</button>
      </div>
    </div>
  );
};

export default LiveCapture;
