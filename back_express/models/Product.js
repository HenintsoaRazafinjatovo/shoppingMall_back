const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }], // tableau de chemins d'images
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  boutiqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Boutique', required: true },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
