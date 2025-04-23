// Routes that require authentication
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import React from 'react';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<></>}/>
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;