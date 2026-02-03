const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB,
      maxPoolSize: parseInt(process.env.MONGO_MAX_POOL) || 20,
      serverSelectionTimeoutMS: parseInt(process.env.MONGO_TIMEOUT) || 5000,
      retryWrites: true,
      w: 'majority'
    });
    console.log('MongoDB connecte');
  } catch (err) {
    console.error('Erreur MongoDB:', err);
    process.exit(1); // crash si pas de DB
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB deconnecte');
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB ferme proprement');
  process.exit(0);
});

module.exports = connectDB;
