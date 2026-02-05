// serverMall.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const mallRoutes = require('./routes/mall/mallRoutes');

const app = express();

// Middlewares
app.use(cors()); // pour autoriser Postman ou frontend à accéder à l'API
app.use(bodyParser.json()); // pour parser les JSON
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/mall', mallRoutes);

// Test route simple
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
