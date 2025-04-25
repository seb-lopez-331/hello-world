import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicRoutes from './components/routes/PublicRoutes';
import DashboardRoutes from './components/routes/DashboardRoutes';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('https://hello-world-qbco.onrender.com')  // Backend URL
      .then(response => response.text())
      .then(data => setMessage(data));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public pages (like home, login, about, etc.) */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Dashboard-specific pages */}
        <Route path="/dashboard/*" element={<DashboardRoutes />} />
      </Routes>
    </Router>
  )
}

export default App;
