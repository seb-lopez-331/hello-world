// useUser.js
import { useEffect, useState } from 'react';

const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const serverUrl = process.env.REACT_APP_SERVER;
      try {
        const res = await fetch(`${serverUrl}/auth/profile`, {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.error("Failed to fetch user data");
          setUser({});
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return user;
};

export default useUser;
