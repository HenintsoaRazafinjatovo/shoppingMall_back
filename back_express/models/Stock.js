const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  alertThreshold: { type: Number, default: 1 }
}, {
  timestamps: { createdAt: false, updatedAt: true } // on garde seulement updatedAt
});

module.exports = mongoose.model('Stock', StockSchema);
