import React from 'react';

import '../../style/AccountCard.css';

const AccountCard = ({ account }) => {
  // const { bankName, accountType, accountNumber, balance, dateConnected } = account;
  const bankName = account.institution.name;
  const lastFour = account.lastFour;
  const accountType = account.type;

  const maskedNumber = `•••• •••• •••• ${lastFour}`;
  // const formattedDate = new Date(dateConnected).toLocaleDateString(undefined, {
  //   year: 'numeric',
  //   month: 'short',
  //   day: 'numeric'
  // });

  return (
    <>
      <div className="card">
        {/** Replace header with the bank account title */}
        <div className="header">
          <h2>{bankName}</h2>
          <span className="account-type">{accountType}</span>
        </div>
        {/** Replace card text with a basic summary (ie account number last 4 digits, routing number last 4 digits, balance) */}
        <div className="account-number">{maskedNumber}</div>
        {/* <div className="balance">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        <div className="connected-date">Connected on {formattedDate}</div> */}
      </div>
    </>
  )
};

export default AccountCard;