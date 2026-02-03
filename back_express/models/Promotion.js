const mongoose = require('mongoose');

const PromotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  discountPercent: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  boutiqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Boutique', default: null },
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Promotion', PromotionSchema);
