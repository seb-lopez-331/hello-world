// Routes that require authentication
import { Routes, Route } from 'react-router-dom';
import React from 'react';

import AppLayout from '../layout/AppLayout';
import AccountsManager from '../settings/AccountsManager';

const DashboardRoutes = ({ user }) => {
  return user ? (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<></>}/>
        <Route path="/linked-accounts" element={<AccountsManager user={ user }/>}/>
      </Route>
    </Routes>
  ) : <h1>Loading</h1>;
};

export default DashboardRoutes;