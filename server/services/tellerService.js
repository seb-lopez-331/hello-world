require('dotenv').config();

const fs = require('fs');
const https = require('https');
const axios = require('axios');
const path = require('path');

// Load base64-encoded cert and key from environment variables
const certBase64 = process.env.TELLER_CERT_B64;
const keyBase64 = process.env.TELLER_KEY_B64;

// Decode base64 into Buffer
const cert = Buffer.from(certBase64, 'base64');
const key = Buffer.from(keyBase64, 'base64');

// Use the certs for HTTPS setup
const httpsOptions = {
  cert: cert,
  key: key,
};

const agent = new https.Agent(httpsOptions);

// Wrapper to make api calls
const callTellerApi = async (method, endpoint, accessToken) => {
  const [username, password] = accessToken.split(':');
  try {
    const response = await axios({
      method: method, // Or 'post' if needed
      url: `https://api.teller.io/${endpoint}`, // API endpoint
      auth: {
        username: username,
        password: password,
      },
      httpsAgent: agent, // Use the custom agent with the certificate and key
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

exports.getAccounts = async (accessToken) => {
  const response = await callTellerApi('get', '/accounts', accessToken);
  return response.data;
};

exports.getBalance = async (accessToken, accountId) => {
  const response = await callTellerApi('get', `/accounts/${accountId}/balances`, accessToken);
  return response.data;
};

exports.getTransactions = async (accessToken, accountId, start, end) => {
  const response = await callTellerApi('get', `/accounts/${accountId}/transactions`, accessToken);
  return response.data;
};
