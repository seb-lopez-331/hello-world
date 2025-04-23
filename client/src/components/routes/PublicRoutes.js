// Routes that do not require authentication
import { Routes, Route } from 'react-router-dom';
import React from 'react';

import LoginPage from '../login/LoginPage';
import ConfirmEmail from '../login/ConfirmEmail';
import ForgotPassword from '../login/ForgotPassword';
import PasswordResetRequested from '../login/PasswordResetRequested';
import ResetPassword from '../login/ResetPassword';

import About from '../misc/About';
import Services from '../misc/Services';
import ContactUs from '../misc/ContactUs';

import Topbar from '../layout/Topbar';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/password-reset-requested" element={<PasswordResetRequested />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<Topbar user={null} handleLogout={null}/>}>
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Route>
    </Routes>
  );
}

export default PublicRoutes;