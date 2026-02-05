const mongoose = require('mongoose');

const BoutiqueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isValidated: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model('Boutique', BoutiqueSchema);
