import React from "react";
import { useTellerConnect } from 'teller-connect-react';

const AddBankAccount = () => {
  const { open, ready } = useTellerConnect({
    applicationId: process.env.REACT_APP_TELLER_APPLICATION_ID,
    onSuccess: (authorization) => {
      // Here I want the user to be logged in
      // Save your access token here
      console.log(authorization);
    },
  });
  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
};

export default AddBankAccount;