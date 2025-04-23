import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom'; 

const LoginLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const serverUrl = process.env.REACT_APP_SERVER;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const serverUrl = process.env.REACT_APP_SERVER;
        const res = await fetch(`${serverUrl}/auth/profile`, {
          credentials: 'include' // ensures cookies are sent
        });

        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  return isLoggedIn ? <Navigate to="/"/> : <Outlet/>;
};

export default LoginLayout;