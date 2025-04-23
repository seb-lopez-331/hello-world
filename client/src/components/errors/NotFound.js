import React from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router for navigation

import '../../style/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container" style={{ color: '#ffa', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <p>It might have been moved or deleted.</p>
      <Link to="/" style={{ color: '#ffa', textDecoration: 'none', fontWeight: 'bold' }}>
        Go back to Home
      </Link>
    </div>
  );
}

export default NotFound;