require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());  // Enable CORS for all routes

const port = process.env.PORT || 5000;

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
