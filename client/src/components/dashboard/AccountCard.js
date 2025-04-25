import { useState, useEffect } from 'react';

import '../../style/AccountCard.css';

const AccountCard = ({ account }) => {
  // const { bankName, accountType, accountNumber, balance, dateConnected } = account;
  const bankName = account.institution.name;
  const accountName = account.name;
  const lastFour = account.lastFour;
  const accountType = account.type;

  // const formattedDate = new Date(dateConnected).toLocaleDateString(undefined, {
  //   year: 'numeric',
  //   month: 'short',
  //   day: 'numeric'
  // });

  const maskedNumber = `•••• •••• •••• ${lastFour}`;
  const [balance, setBalance] = useState("$0");
  const [isGoodBalance, setIsGoodBalance] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      const serverUrl = process.env.REACT_APP_SERVER;
      try {
        console.log(`${serverUrl}/banks/${account.id}/balance`)
        const res = await fetch(`${serverUrl}/banks/${account.id}/balance`, {
          method: 'GET',
          credentials: 'include'
        });
        console.log(res);
        if (res.ok) {
          const data = await res.json();
          const balanceNumber = parseFloat(data.ledger.replace('$', ''));
          setBalance(data.ledger);

          if (account.type == 'credit') {
            setIsGoodBalance(balanceNumber == 0);
          } else {
            setIsGoodBalance(balanceNumber > 0);
          }

        } else {
          console.error("Failed to get balance");
          setBalance("$0");
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
        {/** Replace header with the bank account title */}
        <div className="account-header">
          <h2>{bankName}</h2>
          <h3>{accountName}</h3>
          <span className="account-type">{accountType.toUpperCase()}</span>
        </div>
        {/** Replace card text with a basic summary (ie account number last 4 digits, routing number last 4 digits, balance) */}
        <div className="account-number">{maskedNumber}</div>
        <div className={isGoodBalance ? "balance-good" : "balance-bad"}>{`Balance: $${balance} ${account.currency}`}</div>
        {/* <div className="connected-date">Connected on {formattedDate}</div> */}
      </div>
    </>
  );
};

export default AccountCard;