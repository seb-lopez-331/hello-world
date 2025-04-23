// Routes that require authentication
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import React from 'react';

const DashboardRoutes = () => {
  return (
    <Routes>
      {/*Nest a ProtectedRoute within a Route*/}
    </Routes>
  );
};

export default DashboardRoutes;