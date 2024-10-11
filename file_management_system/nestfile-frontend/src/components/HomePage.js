// src/components/HomePage.js

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// DALL-E generated image links
const folderIcon = "https://files.oaiusercontent.com/file-jsmsOKTjGRre06EDJfho2eyo?se=2024-10-11T10%3A59%3A37Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Df07eb127-7aef-4ada-b417-14b5899b3239.webp&sig=k6g5j2TEtGaVkvd7uB5cETFAD1tROJ2umIxo%2B4XFeXs%3D";

const HomePage = () => {
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State to store search query
  const [searchResults, setSearchResults] = useState({ directories: [], files: [] }); // State to store search results
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch root-level directories and files
    Promise.all([axios.get('/api/directories/'), axios.get('/api/files/')])
      .then(([dirResponse, fileResponse]) => {
        setDirectories(dirResponse.data);
        setFiles(fileResponse.data);
      })
      .catch((error) => {
        console.error("Error fetching directories and files:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Function to handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();

    // Clear previous results
    setSearchResults({ directories: [], files: [] });

    // Search for directories
    axios.get(`/api/directories/search/?q=${searchQuery}`)
      .then(response => {
        setSearchResults(prevState => ({
          ...prevState,
          directories: response.data
        }));
      })
      .catch(error => console.error("Error searching directories:", error));

    // Search for files
    axios.get(`/api/files/search/?q=${searchQuery}`)
      .then(response => {
        setSearchResults(prevState => ({
          ...prevState,
          files: response.data
        }));
      })
      .catch(error => console.error("Error searching files:", error));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-2xl font-semibold text-gray-600 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="home-page container mx-auto px-4 py-8 bg-white rounded-lg shadow-md">
      {/* Navigation Bar */}
      <nav className="mb-8 p-4 rounded-lg bg-blue-500 shadow-md">
        <ul className="flex justify-between items-center">
          <li className="text-white font-bold text-xl">File Explorer</li>
          <ul className="flex space-x-4">
            <li><Link to="/" className="text-white hover:text-blue-300">Home</Link></li>
    
          </ul>
        </ul>
      </nav>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <input
          type="text"
          placeholder="Search for directories or files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-1/2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {/* Search Results Section */}
      {searchResults.directories.length > 0 || searchResults.files.length > 0 ? (
        <section className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-700 mb-8 border-b-2 pb-4 border-gray-300">Search Results</h1>

          {/* Matching Directories */}
          {searchResults.directories.length > 0 && (
            <div className="directories-results mb-6">
              <h2 className="text-xl font-bold">Matching Directories:</h2>
              <ul className="list-disc pl-6">
                {searchResults.directories.map((directory) => (
                  <li
                    key={directory.id}
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => navigate(`/directory/${directory.id}`)}
                  >
                    {directory.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Matching Files */}
          {searchResults.files.length > 0 && (
            <div className="files-results">
              <h2 className="text-xl font-bold">Matching Files:</h2>
              <ul className="list-disc pl-6">
                {searchResults.files.map((file) => (
                  <li
                    key={file.id}
                    className="text-green-500 cursor-pointer hover:underline"
                    onClick={() => navigate(`/file-details/${file.id}`)}
                  >
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ) : searchQuery ? (
        <p className="text-gray-500 italic mt-4">No matching directories or files found for "{searchQuery}".</p>
      ) : null}

      {/* Root Directories Section */}
      <section className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-700 mb-8 border-b-2 pb-4 border-gray-300">List of Directories</h1>
        {directories.length === 0 ? (
          <p className="text-gray-500 italic">No directories found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {directories.map((directory) => (
              <Link
                key={directory.id}
                to={`/directory/${directory.id}`}
                className="bg-blue-100 p-6 rounded-xl shadow hover:bg-blue-200 transition duration-300 transform hover:scale-105 flex items-center"
              >
                <img src={folderIcon} alt="Folder icon" className="w-10 h-10 mr-4" />
                <div>
                  <h2 className="text-2xl font-semibold text-blue-900 mb-2">{directory.name}</h2>
                  <p className="text-blue-700">Directory ID: {directory.id}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Root Files Section */}
      <section>
        <h1 className="text-4xl font-extrabold text-gray-700 mb-8 border-b-2 pb-4 border-gray-300">List of Files</h1>
        {files.length === 0 ? (
          <p className="text-gray-500 italic">No files found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {files.map((file) => (
              <Link
                key={file.id}
                to={`/file-details/${file.id}`}
                className="bg-green-100 p-6 rounded-xl shadow hover:bg-green-200 transition duration-300 transform hover:scale-105 flex items-center"
              >
                <div>
                  <h2 className="text-2xl font-semibold text-green-900 mb-2">{file.name}</h2>
                  <p className="text-green-700">File ID: {file.id}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
