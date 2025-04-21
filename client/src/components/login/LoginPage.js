import { React, useState } from "react";
import { useNavigate } from 'react-router-dom'; 

import '../style/Login.css';

import userIcon from '../assets/person.png';
import emailIcon from '../assets/email.png';
import passwordIcon from '../assets/password.png';

const LoginPage = () => {
  const [action, setAction] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_SERVER;
  
  const handleRegistration = async () => {
    try {
      const res = await fetch(`${serverUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password, username}),
      });
      
      if (!res.ok) {
        res.json().then(err => {
          alert(err.message);
          console.error(err.message);
        })
        return;
      }
      
      // Redirect to email confirmation page
      navigate(`/confirm-email`, { state: { email } });
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }
  
  const handleLogin = async () => {
    try {
      const res = await fetch(`${serverUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password, username}),
        credentials: 'include',
      });
      
      if (!res.ok) {
        res.json().then(err => {
          alert(err.message);
          console.error(err.message);
        })
        return;
      }

      // Redirect to homepage
      navigate('/');
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        {action==="Login"?<div></div>:<div className="input">
          <img src={userIcon} alt="" />
          <input 
            type="text" 
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>}
        <div className="input">
          <img src={emailIcon} alt="" />
          <input 
            type="email" 
            placeholder="Email Id"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input">
          <img src={passwordIcon} alt="" />
          <input 
            type="password"
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        { action === "Sign Up" ? 
          <div> </div> : 
          <div className="forgot-password">
            Lost Password?<nbsp> </nbsp>
            <span onClick={async () => {
              navigate('/forgot-password');
            }}>
              Click Here!
            </span>
          </div>}
        <div className="submit-container">
          <div 
            className={action === "Login" ? "submit-gray" : "submit"}
            onClick={async () => {
              if (action !== "Sign Up") {
                setAction("Sign Up");
              } else {
                handleRegistration();
              }
            }}
          >
            Sign Up
          </div>
          <div 
            className={action === "Sign Up" ? "submit-gray" : "submit"} 
            onClick={async () => {
                if (action !== "Login") {
                  setAction("Login");
                } else {
                  handleLogin();
                }
              }}
          >
            Login
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;