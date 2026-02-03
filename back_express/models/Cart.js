const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  boutiqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Boutique', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [CartItemSchema]
}, {
  timestamps: { createdAt: false, updatedAt: true } // on garde updatedAt
});

module.exports = mongoose.model('Cart', CartSchema);
