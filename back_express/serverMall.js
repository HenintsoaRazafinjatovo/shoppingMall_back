const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const mallRoutes = require('./routes/mall/mallRoutes');
const authRoutes = require('./routes/mall/authRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ CONNEXION MONGODB VIA .ENV (Atlas)
mongoose.connect(process.env.MONGO_URI, {
  maxPoolSize: parseInt(process.env.MONGO_MAX_POOL) || 20,
  serverSelectionTimeoutMS: parseInt(process.env.MONGO_TIMEOUT) || 5000,
})
  .then(() => {
    console.log('✅ MongoDB connected to:', process.env.MONGO_URI);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

app.use('/api/mall', mallRoutes);
app.use('/api/mall/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
