// src/components/FileDetails.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FileDetails = () => {
  const { fileId } = useParams(); // Get the file ID from the URL params
  const [fileDetails, setFileDetails] = useState(null); // State for storing file details
  const [newFileName, setNewFileName] = useState(''); // State for renaming the file
  const [isRenaming, setIsRenaming] = useState(false); // State to toggle renaming input field
  const navigate = useNavigate(); // Hook for navigation

  // Fetch file details when component mounts
  useEffect(() => {
    axios.get(`/api/files/${fileId}/`)
      .then(response => {
        setFileDetails(response.data); // Set file details in state
        setNewFileName(response.data.name); // Set the initial file name for renaming
      })
      .catch(error => console.error("Error fetching file details:", error));
  }, [fileId]);

  // Function to handle file deletion
  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (confirmDelete) {
      axios.delete(`/api/files/${fileId}/`)
        .then(() => {
          alert("File deleted successfully.");
          navigate(`/directory/${fileDetails.directory}`); // Navigate back to the parent directory
        })
        .catch(error => console.error("Error deleting file:", error));
    }
  };

  // Function to handle file renaming
  const handleRename = () => {
    if (!newFileName) {
      alert("File name cannot be empty!");
      return;
    }

    axios.put(`/api/files/${fileId}/`, { name: newFileName })
      .then(response => {
        setFileDetails(response.data); // Update the state with the new file details
        setIsRenaming(false); // Hide the rename input field
        alert("File renamed successfully.");
      })
      .catch(error => console.error("Error renaming file:", error));
  };

  // Function to handle file download
  const handleDownload = () => {
    axios.get(`/api/files/${fileId}/download/`, { responseType: 'blob' })
      .then(response => {
        // Create a new Blob object and set it as a download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileDetails.name); // Set the file name for download
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(error => console.error("Error downloading file:", error));
  };

  // Show loading message while file details are being fetched
  if (!fileDetails) {
    return <p>Loading file details...</p>;
  }

  return (
    <div className="file-details bg-white p-6 rounded shadow-md">
      {/* Display file details */}
      <h2 className="text-xl font-bold">File Details: {fileDetails.name}</h2>
      <p className="text-gray-600">Size: {fileDetails.size} bytes</p>
      <p className="text-gray-600">Directory: {fileDetails.directory}</p>

      {/* Toggle rename input field if renaming is active */}
      {isRenaming ? (
        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Rename File</label>
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            className="border p-2 w-full mb-4"
          />
          <button
            onClick={handleRename}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={() => setIsRenaming(false)} // Cancel renaming
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsRenaming(true)} // Show rename input field
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-4"
        >
          Rename File
        </button>
      )}

      {/* Button to download the file */}
      <button
        onClick={handleDownload}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4 ml-2"
      >
        Download File
      </button>

      {/* Button to delete the file */}
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-4 ml-2"
      >
        Delete File
      </button>

      {/* Button to go back to the parent directory */}
      <button
        onClick={() => navigate(`/directory/${fileDetails.directory}`)}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4 ml-2"
      >
        Back to Parent Directory
      </button>
    </div>
  );
};

export default FileDetails;
