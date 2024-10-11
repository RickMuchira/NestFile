import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteDirectory = ({ onDirectoryDeleted }) => {
  const { directoryId } = useParams();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this directory and all its contents?");
    if (confirmDelete) {
      setIsDeleting(true);
      setErrorMessage('');

      axios.delete(`/api/directories/${directoryId}/`)
        .then(() => {
          alert("Directory deleted successfully.");
          if (onDirectoryDeleted) {
            onDirectoryDeleted(directoryId); // Update the parent component's directory list
          }
          navigate('/'); // Navigate to the root directory after deletion
        })
        .catch(error => {
          setErrorMessage("Error deleting directory. Please try again later.");
          console.error("Error deleting directory:", error);
        })
        .finally(() => {
          setIsDeleting(false);
        });
    }
  };

  return (
    <div className="text-center mt-6">
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`bg-red-500 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400 ${
          isDeleting ? 'cursor-not-allowed bg-red-400' : 'hover:bg-red-600'
        }`}
      >
        {isDeleting ? 'Deleting...' : 'Delete Directory'}
      </button>
      {errorMessage && (
        <div className="mt-4 text-red-600 font-semibold">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default DeleteDirectory;
