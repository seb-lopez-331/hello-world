import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicRoutes from './components/routes/PublicRoutes';
import DashboardRoutes from './components/routes/DashboardRoutes';

function App() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    fetch('https://hello-world-qbco.onrender.com')  // Backend URL
      .then(response => response.text())
      .then(data => setMessage(data));
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const serverUrl = process.env.REACT_APP_SERVER;
      try {
        const res = await fetch(`${serverUrl}/auth/profile`, {
          credentials: 'include' // ensures cookies are sent
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.error("Failed to fetch user data");
          setUser(null);
        } 
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public pages (like home, login, about, etc.) */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Dashboard-specific pages */}
        <Route path="/dashboard/*" element={<DashboardRoutes user={user}/>} />
      </Routes>
    </Router>
  )
}

export default App;
