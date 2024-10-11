// src/components/RenameDirectory.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RenameDirectory = ({ directory, onRename }) => {
  const [newName, setNewName] = useState(directory ? directory.name : '');

  useEffect(() => {
    if (directory && directory.name) {
      setNewName(directory.name);
    }
  }, [directory]);

  const handleRename = () => {
    axios.put(`/api/directories/${directory.id}/`, { name: newName })
      .then(response => {
        onRename(response.data); // Call onRename with the updated directory data
      })
      .catch(error => {
        console.error("Error renaming directory:", error);
      });
  };

  if (!directory) {
    return <p>Loading directory details...</p>;
  }

  return (
    <div className="flex items-center">
      <input
        type="text"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button
        onClick={handleRename}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Rename
      </button>
    </div>
  );
};

export default RenameDirectory;
