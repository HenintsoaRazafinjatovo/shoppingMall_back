const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["ADMIN_CENTRE", "USER", "MANAGER"] },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  profilePicturePath: { type: String, default: '' } // ajouté si tu veux gérer une photo de profil
}, {
  timestamps: true // crée automatiquement createdAt et updatedAt
});

module.exports = mongoose.model('User', UserSchema);
