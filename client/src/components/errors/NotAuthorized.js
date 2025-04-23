import React from 'react';
import { Link } from 'react-router-dom';

const NotAuthorized = () => {
  return (
    <div style={{ color: '#ffa', textAlign: 'center', marginTop: '50px' }}>
      <h1>403 - Not Authorized</h1>
      <p>You don’t have permission to view this page.</p>
      <Link to="/" style={{ color: '#ffa', fontWeight: 'bold', textDecoration: 'none' }}>
        Return to Home
      </Link>
    </div>
  );
};

export default NotAuthorized;
