import React from 'react';
import { Link } from 'react-router-dom';

// Import the DALL-E generated folder icon
const folderIcon = "https://files.oaiusercontent.com/file-jsmsOKTjGRre06EDJfho2eyo?se=2024-10-11T10%3A59%3A37Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3Df07eb127-7aef-4ada-b417-14b5899b3239.webp&sig=k6g5j2TEtGaVkvd7uB5cETFAD1tROJ2umIxo%2B4XFeXs%3D";

const Navbar = () => {
  return (
    <nav className="navbar bg-gray-900 text-white p-5 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Title */}
        <Link to="/" className="flex items-center text-3xl font-bold hover:text-gray-300">
          <img src={folderIcon} alt="Logo" className="w-10 h-10 mr-4 rounded-full border-2 border-white" />
          File Management System
        </Link>

        {/* Navigation Links */}
        <div className="nav-links space-x-8 text-lg font-medium">
          <Link to="/" className="hover:text-gray-300 transition-colors duration-300">
            Home
          </Link>
          <Link to="/create-directory" className="hover:text-gray-300 transition-colors duration-300">
            Create Directory
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
