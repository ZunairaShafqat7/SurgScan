import React, { useState } from 'react';

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    console.log(selectedFile);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (file) {
      console.log("File ready to upload:", file);
      // You can perform further actions here like uploading the file to the server
    } else {
      console.log("No file selected.");
    }
  };

  return (
    <div>
      <h3>Upload a File</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
        />
        <button type="submit">Submit</button>
      </form>
      {file && <p>Selected File: {file.name}</p>}
    </div>
  );
};

export default FileUpload;
