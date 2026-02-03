const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  boutiqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Boutique', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ["PREPARATION", "EN_COURS", "LIVRE"], default: "PREPARATION" }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ["PAID", "PENDING", "CANCELLED"], default: "PENDING" },
  deliveryType: { type: String, enum: ["RETRAIT", "LIVRAISON"], required: true }
}, {
  timestamps: { createdAt: true, updatedAt: false } // on garde createdAt
});

module.exports = mongoose.model('Order', OrderSchema);
