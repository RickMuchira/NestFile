// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Import base CSS styles
import App from './App';  // Import the main App component
// src/index.js or in an axios configuration file

import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';

// Create a root and render the App component into the root DOM element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application wrapped with StrictMode for highlighting potential issues
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
