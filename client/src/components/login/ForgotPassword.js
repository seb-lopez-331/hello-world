import { React, useState } from "react";
import { useNavigate } from 'react-router-dom'; 

import '../style/Login.css';

import emailIcon from '../assets/email.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_SERVER;

  const handleForgotPassword = async () => {
    try {
      const res = await fetch(`${serverUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        res.json().then(err => {
          alert(err.message);
          console.error(err.message);
        })
        return;
      }

      sessionStorage.setItem('passwordResetRequested', 'true');
      navigate('/password-reset-requested', { state: { fromForm: true } });
    } catch (error) {
      console.error("Error during password reset:", error);
    }
  }

  return (
    <div className='container'>
      <div className="header">
        <div className="text">Reset Password</div>
        <div className="underline"></div>
      </div>
      <div className='paragraph'>
        <p>Please provide your email address here:</p>
      </div>
      <div className="input">
        <img src={emailIcon} alt="" />
        <input 
          type="email" 
          placeholder="Email Id"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="submit-container">
        <div 
          className="submit"
          onClick={async () => {
            handleForgotPassword();
          }}
        >
          Submit
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;