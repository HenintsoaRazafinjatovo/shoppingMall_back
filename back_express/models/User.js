const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["ADMIN_CENTRE", "USER", "MANAGER"] },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  profilePicturePath: { type: String, default: '' },
  boutiqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Boutique' } // pour les MANAGER
}, {
  timestamps: true // crée automatiquement createdAt et updatedAt
});

module.exports = mongoose.model('User', UserSchema);
