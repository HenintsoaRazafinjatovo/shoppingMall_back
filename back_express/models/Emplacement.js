const mongoose = require('mongoose');

const EmplacementSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Ex: A1, B2, C3
  zone: { type: String, required: true }, // Ex: A, B, C, D
  floor: { type: Number, default: 0 }, // Étage: 0 = RDC, 1, 2...
  description: { type: String, default: '' },
  boutiqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Boutique', default: null },
  isAvailable: { type: Boolean, default: true },
  surface: { type: Number, default: 0 }, // Surface en m²
  rent: { type: Number, default: 0 } // Loyer mensuel
}, {
  timestamps: true
});

module.exports = mongoose.model('Emplacement', EmplacementSchema);
