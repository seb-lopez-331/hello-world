// Routes that require authentication
import { Routes, Route } from 'react-router-dom';
import React from 'react';

import AppLayout from '../layout/AppLayout';
import AccountsManager from '../settings/AccountsManager';

const DashboardRoutes = () => {
  return ( <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<></>}/>
      <Route path="/linked-accounts" element={<AccountsManager />}/>
    </Route>
  </Routes> );
};

export default DashboardRoutes;