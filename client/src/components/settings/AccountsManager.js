// Linked bank accounts, manual accounts, balances
import { useState, useEffect } from "react";
import { useTellerConnect } from 'teller-connect-react';

import AccountCard from '../dashboard/AccountCard';

import '../../style/AccountsManager.css';

const AccountsManager = ({ user }) => {
  console.log(user);
  const bankAccounts = user?.connectedAccounts;

  const handleSuccess = async (authorization) => {
    // Save your access token here
    const serverUrl = process.env.REACT_APP_SERVER;
    try {
      const res = await fetch(`${serverUrl}/banks/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authorization }),
        credentials: 'include',
      });
      console.log(authorization);

      if (!res.ok) {
        res.json().then(err => {
          alert(err.message);
          console.error(err.message);
        })
        return;
      }
    } catch (error) {
      console.error("Error during registering bank:", error);
    }
  }

  const { open, ready } = useTellerConnect({
    applicationId: process.env.REACT_APP_TELLER_APPLICATION_ID,
    onSuccess: handleSuccess,
  });

  return (
    <>
      <div className="container">
        <div className="bank-accounts">
          { bankAccounts?.map((account) => <AccountCard account={account} />) }
        </div>
        <div className="connect-container">
          <button 
            className="connect" 
            onClick={() => open()} 
            disabled={!ready}
          >
            (+) Connect a bank account
          </button>
        </div>
      </div>
    </>
  );
};

export default AccountsManager;