import React, { useEffect, useState } from 'react';
import AddBankAccount from './components/AddBankAccount';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('https://hello-world-qbco.onrender.com')  // Backend URL
      .then(response => response.text())
      .then(data => setMessage(data));
  }, []);

  return (
    <div className="App">
      <h1>{message}</h1>
      <AddBankAccount />
    </div>
  );
}

export default App;
