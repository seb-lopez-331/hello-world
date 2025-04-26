// Linked bank accounts, manual accounts, balances
import { useState, useEffect } from "react";
import { useTellerConnect } from 'teller-connect-react';

import useUser from '../utils/useUser';

import AccountCard from '../dashboard/AccountCard';

import '../../style/AccountsManager.css';

const AccountsManager = () => {
  const [isConfirmDeleteVisible, setIsConfirmDeleteVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [data, setData] = useState([]);

  const handleXClicked = async () => {
    console.log(isConfirmDeleteVisible);
    setIsConfirmDeleteVisible(true);
  };

  const closePopup = async () => {
    setIsConfirmDeleteVisible(false);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);

    setData(user.connectedAccounts.filter(acc => {
      const accName = acc.name.toLowerCase();
      const bankName = acc.institution.name.toLowerCase();
      const accSubtype = acc.subtype.split('_').join(' ').toLowerCase();
      const lastFour = acc.lastFour.toLowerCase();
      const lowerCasedQuery = query.toLowerCase()

      return accName.includes(lowerCasedQuery) || 
        bankName.includes(lowerCasedQuery) ||
        accSubtype.includes(lowerCasedQuery) ||
        lastFour.includes(lowerCasedQuery);
    }));
  };

  const serverUrl = process.env.REACT_APP_SERVER;

  const handleConfirmDeletion = async (acc) => {
    try {
      const res = await fetch(`${serverUrl}/banks/${acc.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        window.location.reload();
      } else {
        console.log("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleSuccess = async (authorization) => {
    try {
      const res = await fetch(`${serverUrl}/banks/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authorization }),
        credentials: 'include',
      });

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

    window.location.reload();
  }

  const { open, ready } = useTellerConnect({
    applicationId: process.env.REACT_APP_TELLER_APPLICATION_ID,
    onSuccess: handleSuccess,
  });

  const user = useUser();
  if (!user) return <p>Loading...</p>;
  
  return (
    <>
      {/* TODO: Add a popup thing here to confirm delete, follow a tutorial */}
      <div className="accounts-container">
        <h1 className="accounts-manager-header">
          Linked Accounts 
        </h1>
        {/* TODO: Rename this container and add 1.) search bar, 2.) submit button, 3.) connect bank account */}
        <div className="accounts-header">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleInputChange}
          />
          <button 
            className="connect" 
            onClick={() => open()} 
            disabled={!ready}
          >
            (+) Connect a bank account
          </button>
        </div>
        <div className="bank-accounts">
          { (query === '' ? user.connectedAccounts : data).map((account) => <AccountCard 
            account={account}
            handleXClicked={handleXClicked}
            handleConfirmDeletion={() => {handleConfirmDeletion(account)}}
           />) }
        </div>
      </div>
    </>
  );
};

export default AccountsManager;