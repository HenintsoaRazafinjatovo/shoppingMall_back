const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, {
  timestamps: true // createdAt et updatedAt
});

module.exports = mongoose.model('Category', CategorySchema);
