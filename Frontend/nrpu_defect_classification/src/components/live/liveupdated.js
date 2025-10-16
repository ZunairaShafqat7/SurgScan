import React, { useRef, useEffect, useState } from 'react';

const LiveCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');

  useEffect(() => {
    const getCameras = async () => {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);

        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (err) {
        console.error('Error listing devices:', err);
      }
    };

    getCameras();
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      if (!selectedDeviceId) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: selectedDeviceId } }
        });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('Error accessing selected camera:', err);
      }
    };

    startCamera();

    return () => {
      const stream = videoRef.current?.srcObject;
      stream?.getTracks()?.forEach(track => track.stop());
    };
  }, [selectedDeviceId]);

  const handleDeviceChange = (e) => {
    setSelectedDeviceId(e.target.value);
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const targetWidth = 1600;
    const targetHeight = 1600;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext('2d');
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const videoAspectRatio = videoWidth / videoHeight;
    const canvasAspectRatio = targetWidth / targetHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (videoAspectRatio > canvasAspectRatio) {
      drawHeight = targetHeight;
      drawWidth = videoWidth * (targetHeight / videoHeight);
      offsetX = -(drawWidth - targetWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = targetWidth;
      drawHeight = videoHeight * (targetWidth / videoWidth);
      offsetX = 0;
      offsetY = -(drawHeight - targetHeight) / 2;
    }

    context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
    const imageData = canvas.toDataURL('image/jpg', 1.0);
    onCapture?.(imageData);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="cameraSelect">Select Camera:</label>
        <select id="cameraSelect" onChange={handleDeviceChange} value={selectedDeviceId}>
          {devices.map((device, index) => (
            <option key={index} value={device.deviceId}>
              {device.label || `Camera ${index + 1}`}
            </option>
          ))}
        </select>
      </div>

      <video
        ref={videoRef}
        autoPlay
        style={{ width: '100%', maxWidth: '640px', borderRadius: '10px' }}
      />
      <br />
      <button onClick={captureImage}>Capture</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default LiveCapture;
