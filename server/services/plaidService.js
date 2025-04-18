require('dotenv').config();

const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox, // use .development or .production as needed
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET
    }
  }
});

const client = new PlaidApi(configuration);

exports.createLinkToken = async (userId, clientName) => {
  try {
    const response = await client.linkTokenCreate({
      user: { client_user_id: userId },
      client_name: clientName,
      products: ['transactions', 'auth'], // Add any other Plaid products you need
      country_codes: ['US'],
      language: 'en',
    });

    return response.data;  // Contains the link_token
  } catch (error) {
    console.error('Error creating Plaid link token:', error);
    throw new Error('Could not create link token');
  }
};

exports.exchangePublicToken = async (publicToken) => {
  const response = await client.itemPublicTokenExchange({ public_token: publicToken });
  return response.data;
};

exports.getAccounts = async (accessToken) => {
  const response = await client.accountsGet({ access_token: accessToken });
  return response.data.accounts;
};

exports.getBalance = async (accessToken) => {
  const response = await client.accountsBalanceGet({ access_token: accessToken });
  return response.data;
};

exports.getTransactions = async (accessToken, start, end) => {
  const response = await client.transactionsGet({
    access_token: accessToken,
    start_date: start || '2024-01-01',
    end_date: end || new Date().toISOString().split('T')[0],
    options: { count: 100 }
  });
  return response.data.transactions;
};

exports.removeItem = async (accessToken) => {
  await client.itemRemove({ access_token: accessToken });
};
