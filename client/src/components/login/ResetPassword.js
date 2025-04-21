import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import '../style/Login.css';
import passwordIcon from '../assets/password.png';

const ResetPassword = () => {
  const [isValidToken, setIsValidToken] = useState(null);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const serverUrl = process.env.REACT_APP_SERVER;

  useEffect(() => {
    // Retrieve the token from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const validateToken = async () => {
      const serverUrl = process.env.REACT_APP_SERVER;
      try {
        const res = await fetch(`${serverUrl}/auth/confirm-password-reset-token/${token}`, {
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

  const resetPassword = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const res = await fetch(`${serverUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({token, password}),
      });

      // TODO: Change this to some alert dialog
      if (!res.ok) {
        res.json().then(err => {
          alert(err.message);
          console.error(err.message);
        })
        return;
      }

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error("Error during password reset:", error);
    }
  }

  if (isValidToken === null) {
    return (
      <div className="header">
        <div className="text">Loading ... </div>
      </div>
    );
  }

  return isValidToken ? (
    <div className="container">
      <div className="header">
        <div className="text">Reset Password</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={passwordIcon} alt="" />
          <input 
            type="password"
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
          <div className="submit-container">
            <div 
              className="submit"
              onClick={async () => {
                resetPassword();
              }}
            >
              Submit
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div> Invalid or expired token. </div>
  );
};

export default ResetPassword;