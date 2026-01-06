const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.json({});
});

app.use(cors({ origin: '*' })); // Allow GitHub Pages
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/libraryDB')
  .then(() => console.log('✓ MongoDB Local Connected'))
  .catch(err => console.log('MongoDB Error:', err));

app.use('/api/books', require('./routes/books'));

app.listen(5000, () => {
  console.log('📚 Backend: http://localhost:5000');
});
