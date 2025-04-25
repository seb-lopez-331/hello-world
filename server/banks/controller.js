const { encrypt, decrypt } = require('../services/cryptoTools');
const key = Buffer.from(process.env.TELLER_ACCESS_TOKEN_ENCRYPTION_KEY, 'base64');

const BankAccount = require('../models/BankAccount');
const User = require('../models/User');

const tellerService = require('../services/tellerService');
const redisClient = require('../services/redisClient');

// For this, the access token will be propagated to the backend
exports.connectBank = async (req, res) => {
  try {
    console.log(req.body);
    const { authorization } = req.body;
    console.log(req.body);
    const accessToken = authorization.accessToken;

    console.log("getting accounts from access token")
    const accounts = await tellerService.getAccounts(accessToken);
    console.log("got accounts from access token");

    const accountsArray = accounts.map(acc => ({
      userId: req.user.id,
      accessToken: encrypt(accessToken, key),
      enrollmentId: acc.enrollment_id,
      links: {
        balances: acc.links.balances,
        self: acc.links.self,
        transactions: acc.links.transactions,
      },
      institution: {
        name: acc.institution.name,
        id: acc.institution.id,
      },
      type: acc.type,
      name: acc.name,
      subtype: acc.subtype,
      currency: acc.currency,
      id: acc.id,
      lastFour: acc.last_four,
      status: acc.status,
    }));

    // TODO: something like this, see API reference
    const savedAccounts = await BankAccount.insertMany(accountsArray);
    const savedAccountDBIDs = savedAccounts.map(acc => acc._id);
    console.log("saved accounts into db")

    await User.findByIdAndUpdate(req.user.id, {
      $push: { connectedAccounts: { $each: savedAccountDBIDs } }
    });
    console.log("insert all the saved accounts");

    res.status(201).json(savedAccounts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error connecting bank account', error });
  }
};

exports.getBankAccounts = async (req, res) => {
  const accounts = await BankAccount.find({ userId: req.user.id });
  res.json(accounts);
};

exports.disconnectAccount = async (req, res) => {
  const { accountId } = req.params;
  const account = await BankAccount.findOne({ id: accountId });

  if (!account) return res.status(404).json({ message: 'Account not found' });

  try {
    const accessToken = decrypt(account.accessToken, key);
    await tellerService.deleteAccount(accessToken, account.id);
    await BankAccount.deleteOne({ id: account.id });
    res.json({ message: 'Account successfully disconnected' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getAccountBalance = async (req, res) => {
  const { accountId } = req.params;
  const account = await BankAccount.findOne({ userId: req.user.id, id: accountId });

  if (!account) return res.status(404).json({ message: 'Account not found' });

  const cacheKey = `balance:${accountId}`;

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json({ ...JSON.parse(cached), cached: true });
    }

    const accessToken = decrypt(account.accessToken, key);
    const balances = await tellerService.getBalance(accessToken, account.id);

    // Store in Redis with 1-day TTL
    await redisClient.set(cacheKey, JSON.stringify(balances), {
      EX: 60 * 60 * 24,
    });

    res.json({ ...balances, cached: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }  
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
