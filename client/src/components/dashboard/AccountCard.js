import { useState, useEffect } from 'react';
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md";

import '../../style/AccountCard.css';

const AccountCard = ({ account, handleXClicked, handleConfirmDeletion }) => {
  const bankName = account.institution.name.toUpperCase();
  const lastFour = account.lastFour;
  const accountType = account.type;
  const accountSubtype = account.subtype.split('_').join(' ').toUpperCase();
  const accountName = account.name.toUpperCase();

  // We only include bank name if not already inside the account name
  const includeBankName = accountName.indexOf(bankName) === -1;

  const maskedNumber = `•••• •••• •••• ${lastFour}`;

  const [balance, setBalance] = useState("0");
  const [isGoodBalance, setIsGoodBalance] = useState(false);
  

  const serverUrl = process.env.REACT_APP_SERVER;

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch(`${serverUrl}/banks/${account.id}/balance`, {
          method: 'GET',
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          const balanceNumber = parseFloat(data.ledger.replace('$', ''));
          setBalance(data.ledger);

          if (accountType === 'credit') {
            setIsGoodBalance(balanceNumber == 0);
          } else {
            setIsGoodBalance(balanceNumber > 0);
          }

        } else {
          console.error("Failed to get balance");
          setBalance("0");
          setIsGoodBalance(accountType === 'credit');
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, []);


  return (
    <>
      <div className="account-card">
        {/** We can add a small container at the top, maybe for the logo and x icon*/}
        <div className="top-container">
          <MdIcons.MdAccountBalance className="account-balance-icon"/>
          <IoIcons.IoMdClose className="x-icon" onClick={handleXClicked}/>
        </div>
        <div className="account-header">
          <h2>{ includeBankName ? bankName : '' } {accountName} </h2>
          <h3>{accountSubtype}</h3>
        </div>
        <div className="account-number">{maskedNumber}</div>
        <div className={isGoodBalance ? "balance-good" : "balance-bad"}>{`Balance: $${balance} ${account.currency}`}</div>
      </div>
    </>
  );
};

export default AccountCard;