const mongoose = require('mongoose');

const BoutiqueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  logo: { type: String, default: '' },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // référence à l'utilisateur propriétaire
  isValidated: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Boutique', BoutiqueSchema);
