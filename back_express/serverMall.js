const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const mallRoutes = require('./routes/mall/mallRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ CONNEXION MONGODB ICI
mongoose.connect('mongodb://127.0.0.1:27017/shopping_mall')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/mall', mallRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
