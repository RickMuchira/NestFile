// src/components/DirectoryList.js

import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DirectoryList = () => {
  const { directoryId } = useParams(); // Get the current directory ID from URL params
  const [subDirectories, setSubDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const [newSubdirectoryName, setNewSubdirectoryName] = useState('');
  const [currentDirectoryName, setCurrentDirectoryName] = useState('');
  const [parentDirectoryId, setParentDirectoryId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current directory details
    axios.get(`/api/directories/${directoryId}/`)
      .then(response => {
        setCurrentDirectoryName(response.data.name);
        setParentDirectoryId(response.data.parent);
      })
      .catch(error => console.error("Error fetching directory details:", error));

    // Fetch subdirectories and files within the given directory
    axios.get(`/api/directories/${directoryId}/sub_directories/`).then(response => setSubDirectories(response.data));
    axios.get(`/api/directories/${directoryId}/files/`).then(response => setFiles(response.data));
  }, [directoryId]);

  // Define the function for creating a subdirectory
  const handleCreateSubdirectory = () => {
    if (!newSubdirectoryName) {
      alert("Subdirectory name cannot be empty.");
      return;
    }

    axios.post(`/api/directories/${directoryId}/create_subdirectory/`, { name: newSubdirectoryName })
      .then(response => {
        setSubDirectories([...subDirectories, response.data]); // Add the new subdirectory to the state
        setNewSubdirectoryName(''); // Reset the input field
      })
      .catch(error => console.error("Error creating subdirectory:", error));
  };

  // Define the function for file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      formData.append('directory', directoryId);

      axios.post('/api/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then(response => {
          setFiles([...files, response.data]); // Add the new file to the state
        })
        .catch(error => console.error("Error uploading file:", error));
    }
  };

  // Handle directory deletion
  const handleDeleteDirectory = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this directory and its contents?");
    if (confirmDelete) {
      axios.post(`/api/directories/${directoryId}/delete_directory_and_contents/`)
        .then(() => {
          alert("Directory and its contents deleted successfully.");
          if (parentDirectoryId) {
            navigate(`/directory/${parentDirectoryId}`); // Navigate back to parent directory
          } else {
            navigate(`/`); // Navigate back to root directory if there's no parent
          }
        })
        .catch(error => console.error("Error deleting directory:", error));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Contents of Directory: {currentDirectoryName}</h1>
      {/* Link to navigate to parent directory */}
      {parentDirectoryId && (
        <Link to={`/directory/${parentDirectoryId}`} className="text-blue-500 underline mb-4 inline-block">
          Back to Parent Directory
        </Link>
      )}

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="New Subdirectory Name"
          value={newSubdirectoryName}
          onChange={(e) => setNewSubdirectoryName(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={handleCreateSubdirectory}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Subdirectory
        </button>
      </div>

      <div className="flex items-center mb-4">
        <label className="mr-2">Upload File: </label>
        <input type="file" onChange={handleFileUpload} />
      </div>

      {/* Button to delete the current directory */}
      <div className="flex items-center mb-4">
        <button
          onClick={handleDeleteDirectory}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete Current Directory and Contents
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-4">Subdirectories</h2>
      <div className="grid grid-cols-1 gap-4">
        {subDirectories.map(directory => (
          <Link
            key={directory.id}
            to={`/directory/${directory.id}`} // Navigate to the subdirectory
            className="bg-blue-100 p-4 rounded hover:bg-blue-200"
          >
            {directory.name}
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-4">Files</h2>
      <div className="grid grid-cols-1 gap-4">
        {files.map(file => (
          <div key={file.id} className="bg-green-100 p-4 rounded">
            {file.name}
            {/* Button to navigate to the file deletion page */}
            <Link to={`/file-details/${file.id}`} className="ml-4 text-red-500 underline hover:text-red-700">
              Delete File
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectoryList;
