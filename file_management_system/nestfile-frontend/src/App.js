// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateDirectory from './components/CreateDirectory';
import FileUpload from './components/FileUpload';
import DirectoryList from './components/DirectoryList';
import FileDetails from './components/FileDetails';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Route for creating a new directory */}
          <Route path="/create-directory" element={<CreateDirectory />} />
          {/* Route for uploading a file */}
          <Route path="/upload-file" element={<FileUpload />} />
          {/* Route for viewing directories and files */}
          <Route path="/directory/:directoryId" element={<DirectoryList />} />
          {/* Route for viewing file details */}
          <Route path="/file-details/:fileId" element={<FileDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
