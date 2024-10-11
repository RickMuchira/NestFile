// src/components/FileList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FileList = () => {
  const { directoryId } = useParams();  // Get the directory ID from the URL parameter
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch files for the given directory ID
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/directories/${directoryId}/files/`);
        setFiles(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching files');
        setLoading(false);
      }
    };

    fetchFiles();
  }, [directoryId]);  // Re-fetch data whenever the directory ID changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h2 className="text-2xl font-bold mb-4">Files in Directory {directoryId}</h2>
      
      {/* Display list of files */}
      <ul className="file-list">
        {files.map((file) => (
          <li key={file.id} className="file-item">
            <span>{file.name}</span>
            <div className="file-actions">
              {/* Buttons to perform actions on files */}
              <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleView(file)}>
                View
              </button>
              <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleDownload(file)}>
                Download
              </button>
              <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(file.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  // Handle viewing a file (could open a modal or redirect)
  function handleView(file) {
    alert(`Viewing file: ${file.name}`);
  }

  // Handle downloading a file
  function handleDownload(file) {
    const downloadLink = document.createElement('a');
    downloadLink.href = file.file;  // Use file's URL for download
    downloadLink.download = file.name;
    downloadLink.click();
  }

  // Handle deleting a file
  async function handleDelete(fileId) {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        await axios.delete(`/api/files/${fileId}/`);
        setFiles(files.filter((file) => file.id !== fileId));  // Remove file from state
        alert('File deleted successfully');
      } catch (err) {
        alert('Error deleting file');
      }
    }
  }
};

export default FileList;
