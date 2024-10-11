// src/components/FileUpload.js

import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const { directoryId } = useParams();  // Get the current directory ID
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', directoryId);

    axios
      .post('/api/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => {
        navigate(`/directory/${directoryId}`);  // Redirect to current directory after upload
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="file-upload bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload New File</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleFileChange}
          className="border p-2 rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 mt-4 rounded hover:bg-green-600"
        >
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
