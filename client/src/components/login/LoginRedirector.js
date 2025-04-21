import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const LoginRedirector = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This is to check if we are logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const serverUrl = process.env.REACT_APP_SERVER;
        const res = await fetch(`${serverUrl}/auth/profile`, {
          credentials: 'include' // ensures cookies are sent
        });

        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setUser(data);
      } catch {
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user === undefined ? <Navigate to="/login" replace />: <div>Welcome home, {user.username}</div>
}

export default LoginRedirector;