// src/components/CreateDirectory.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreateDirectory = () => {
  const { directoryId } = useParams();
  const [directoryName, setDirectoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    axios.post('/api/directories/', { name: directoryName, parent: directoryId || null })
      .then(response => {
        setSuccessMessage('Directory created successfully!');
        setTimeout(() => {
          navigate(directoryId ? `/directory/${directoryId}` : `/`);
        }, 1000);
      })
      .catch(error => {
        setError("Error creating directory. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Create a New Directory</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="directoryName">
            Directory Name
          </label>
          <input
            id="directoryName"
            type="text"
            value={directoryName}
            onChange={(e) => setDirectoryName(e.target.value)}
            className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:border-blue-500"
            placeholder="Enter directory name"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-3 rounded-md text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Directory'}
        </button>
      </form>
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {successMessage && <div className="mt-4 text-green-500">{successMessage}</div>}
    </div>
  );
};

export default CreateDirectory;
