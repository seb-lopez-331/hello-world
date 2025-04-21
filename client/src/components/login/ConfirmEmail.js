import { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

import './ConfirmEmail.css';

const ConfirmEmail = () => {
  const [isValidToken, setIsValidToken] = useState(null);
  const navigate = useNavigate(); // Hook to navigate to other pages
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    // Retrieve the token from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if ((!email && !token) || isValidToken) {
      navigate('/');
      return;
    }

    else if (!token) {
      return;
    }

    const validateToken = async () => {
      const serverUrl = process.env.REACT_APP_SERVER;
      try {
        const res = await fetch(`${serverUrl}/auth/confirm-email/${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!res.ok) {
          console.error("Invalid token", res);
          setIsValidToken(false);
        } else {
          setIsValidToken(true);
        }
      } catch (error) {
        console.error("Error during token verification:", error);
        setIsValidToken(false);
      };
    };

    validateToken();
  });

  if (isValidToken === null) {
    console.log('here')
    return (<div className="card">
      <h2 className="header">Account Confirmation</h2>
      <p>
        An email has been sent to <span className="font-medium">{email}</span>.
        <br />
        Check your email and click the link to proceed.
      </p>
    </div>); 
  }

  else {
    return isValidToken === true ? (
      <div> Email confirmed successfully! </div> 
    ) : (
      <div> Invalid or expired token. </div>
    )
  };
};

export default ConfirmEmail;
