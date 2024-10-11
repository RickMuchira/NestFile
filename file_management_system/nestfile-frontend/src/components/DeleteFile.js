// src/components/DeleteFile.js

import React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteFile = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();

  const handleDelete = () => {
    axios
      .delete(`/api/files/${fileId}/`)
      .then(() => {
        navigate(-1);  // Redirect to the previous page after deletion
      })
      .catch((error) => console.log(error));
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Delete File
    </button>
  );
};

export default DeleteFile;
