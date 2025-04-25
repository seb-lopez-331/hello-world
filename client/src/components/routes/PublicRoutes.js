// Routes that do not require authentication
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

import LoginPage from '../login/LoginPage';
import ConfirmEmail from '../login/ConfirmEmail';
import ForgotPassword from '../login/ForgotPassword';
import PasswordResetRequested from '../login/PasswordResetRequested';
import ResetPassword from '../login/ResetPassword';

import About from '../misc/About';
import Services from '../misc/Services';
import ContactUs from '../misc/ContactUs';

import NotFound from '../errors/NotFound';
import NotAuthorized from '../errors/NotAuthorized';

import AppLayout from '../layout/AppLayout';
import LoginLayout from '../layout/LoginLayout';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route element={<LoginLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset-requested" element={<PasswordResetRequested />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      
      <Route path="/unauthorized" element={<NotAuthorized />} />
      <Route path="/*" element={<NotFound />} />

      <Route element={<AppLayout />}>
        <Route path ="/" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Route>
    </Routes>
  );
}

export default PublicRoutes;