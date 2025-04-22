import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AddBankAccount from './components/banks/AddBankAccount';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginRedirector from './components/login/LoginRedirector';
import LoginPage from './components/login/LoginPage';
import ConfirmEmail from './components/login/ConfirmEmail';
import ForgotPassword from './components/login/ForgotPassword';
import PasswordResetRequested from './components/login/PasswordResetRequested';
import ResetPassword from './components/login/ResetPassword';

import Sidebar from './components/layout/Sidebar';

import Home from './components/main/Home';



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
        <Route element={<LoginRedirector />}>
          <Route 
            path="/*" 
            element={
              <>
                <Sidebar/>
              </>
            } 
          />
          
          {/* <Route path="/foo" element={<Foo />} /> */}
          {/* <Route path="/about" element={<About />} /> */}
          {/* Add more routes here */}
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset-requested" element={<PasswordResetRequested />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  )
}

export default App;
