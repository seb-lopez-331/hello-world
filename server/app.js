require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors({
  origin: process.env.CLIENT,
  credentials: true,
}));  // Enable CORS for all routes
app.use(express.json()); // Handle authentication
app.use(cookieParser());

const port = process.env.PORT || 5000;

const authRoutes = require('./auth/routes');
app.use('/auth', authRoutes);

const bankRoutes = require('./banks/routes');
app.use('/banks', bankRoutes);

// Use environment variables for MongoDB URI
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));


// Simple route to return "Hello World"
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
