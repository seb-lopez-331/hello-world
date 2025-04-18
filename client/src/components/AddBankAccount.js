import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AddBankAccount = () => {
  const [linkToken, setLinkToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the link token when the component mounts
  useEffect(() => {
    const backendUrl = process.env.REACT_APP_SERVER || 'http://localhost:5000';
    const clientUserId = uuidv4();

    const fetchLinkToken = async () => {
      try {
        console.log('what the heck')
        const response = await fetch(`${backendUrl}/banks/create-link-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            user: {
                id: clientUserId
            }
         }),
        });
        console.log(response);
        const data = await response.json();
        setLinkToken(data.link_token);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching link token:', err);
        setError('Could not fetch link token. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchLinkToken();
  }, []);

  // Handle Plaid Link success
  const handlePlaidLinkSuccess = async (public_token, metadata) => {
    try {
      const response = await fetch(`${backendUrl}/banks/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Successfully connected bank account:', data);
        alert('Bank account added successfully!');
      } else {
        const errorData = await response.json();
        alert('Error connecting bank account: ' + errorData.message);
      }
    } catch (err) {
      console.error('Error during Plaid connection:', err);
      alert('Something went wrong. Please try again later.');
    }
  };

  // Initialize Plaid Link when link token is available
  const initializePlaidLink = () => {
    if (window.Plaid) {
      const handler = window.Plaid.create({
        token: linkToken,
        onSuccess: handlePlaidLinkSuccess,
        onExit: (error, metadata) => {
          if (error) {
            console.error('Plaid Link exited with error:', error);
          }
          console.log('Exit metadata:', metadata);
        },
      });

      handler.open();
    } else {
      alert('Plaid is not loaded. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading Plaid Link...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Add a New Bank Account</h1>
      <button onClick={initializePlaidLink} disabled={!linkToken}>
        Connect Bank Account
      </button>
    </div>
  );
};

export default AddBankAccount;
