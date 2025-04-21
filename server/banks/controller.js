// const plaidService = require('../services/plaidService');
// TODO: USE TELLER INSTEAD
const BankAccount = require('../models/BankAccount');

const tellerService = require('../services/tellerService');

// For this, the access token will be propagated to the backend
exports.connectBank = async (req, res) => {
  try {
    const { public_token } = req.body;
    const { access_token, item_id } = await plaidService.exchangePublicToken(public_token);

    const accounts = await tellerService.getAccounts(access_token);

    // TODO: something like this, see API reference
    const savedAccounts = await BankAccount.insertMany(
      accounts.map(acc => ({
        userId: req.user.id,
        accessToken: access_token,
        itemId: item_id,
        accountId: acc.account_id,
        name: acc.name,
        mask: acc.mask,
        type: acc.type,
        subtype: acc.subtype
      }))
    );

    res.status(201).json(savedAccounts);
  } catch (error) {
    res.status(500).json({ message: 'Error connecting bank account', error });
  }
};

exports.getBankAccounts = async (req, res) => {
  const accounts = await BankAccount.find({ userId: req.user.id });
  res.json(accounts);
};

exports.disconnectBank = async (req, res) => {
  const { accountId } = req.params;
  const account = await BankAccount.findOne({ userId: req.user.id, accountId });

  if (!account) return res.status(404).json({ message: 'Account not found' });

  await plaidService.removeItem(account.accessToken);
  await BankAccount.deleteOne({ accountId });

  res.json({ message: 'Account disconnected' });
};

exports.getAccountBalance = async (req, res) => {
  const { accountId } = req.params;
  const account = await BankAccount.findOne({ userId: req.user.id, accountId });

  if (!account) return res.status(404).json({ message: 'Account not found' });

  const balances = await plaidService.getBalance(account.accessToken);
  const balanceInfo = balances.accounts.find(acc => acc.account_id === accountId);

  res.json(balanceInfo);
};

exports.getAccountTransactions = async (req, res) => {
  const { accountId } = req.params;
  const { start_date, end_date } = req.query;
  const account = await BankAccount.findOne({ userId: req.user.id, accountId });

  if (!account) return res.status(404).json({ message: 'Account not found' });

  const transactions = await plaidService.getTransactions(
    account.accessToken,
    start_date,
    end_date
  );

  res.json(transactions);
};
