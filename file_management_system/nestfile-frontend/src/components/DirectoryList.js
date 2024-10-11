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
    axios.get(`/api/directories/${directoryId}/sub_directories/`)
      .then(response => setSubDirectories(response.data))
      .catch(error => console.error("Error fetching subdirectories:", error));

    axios.get(`/api/directories/${directoryId}/files/`)
      .then(response => setFiles(response.data))
      .catch(error => console.error("Error fetching files:", error));
  }, [directoryId]);

  // Function to create a new subdirectory in the current directory
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

  // Function to handle file uploads to the current directory
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

  // Function to delete the current directory and its contents
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
        {/* Input for creating a new subdirectory */}
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
        {/* File upload input */}
        <label className="mr-2">Upload File: </label>
        <input type="file" onChange={handleFileUpload} />
      </div>

      {/* Button to delete the current directory and its contents */}
      <div className="flex items-center mb-4">
        <button
          onClick={handleDeleteDirectory}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete Current Directory and Contents
        </button>
      </div>

      {/* List of subdirectories */}
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

      {/* List of files */}
      <h2 className="text-xl font-semibold mt-4">Files</h2>
      <div className="grid grid-cols-1 gap-4">
        {files.map(file => (
          <div key={file.id} className="bg-green-100 p-4 rounded">
            {file.name}
            {/* Button to navigate to the file details page for renaming/deleting */}
            <Link to={`/file-details/${file.id}`} className="ml-4 text-blue-500 underline hover:text-blue-700">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DirectoryList;
