require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cors());  // Enable CORS for all routes
app.use(express.json()); // Handle authentication
app.use(cookieParser());

const port = process.env.PORT || 5000;

const authRoutes = require('./auth/routes');
app.use('/auth', authRoutes);

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

// const mongoose = require('mongoose');

// username = process.env.MONGODB_USERNAME
// password = process.env.MONGODB_PASSWORD

// mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.mongodb.net/hello-world`, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));
