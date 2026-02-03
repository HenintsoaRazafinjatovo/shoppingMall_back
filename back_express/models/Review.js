const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: "" }
}, {
  timestamps: { createdAt: true, updatedAt: false } // on garde createdAt
});

module.exports = mongoose.model('Review', ReviewSchema);
