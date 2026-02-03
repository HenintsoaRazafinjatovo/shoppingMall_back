const BaseModel = require('./BaseModel');
const User = require('./User');
const { hashPassword, verifyPassword } = require('../utils/password');

class UserModel extends BaseModel {
  constructor() {
    super(User); 
  }

  // Création d'utilisateur avec hash du mot de passe
  async createUser(userData) {
    const { email, password, fullName, phone = '', role = 'USER', profilePicturePath = '' } = userData;

    const existingUser = await this.findOne({ email });
    if (existingUser) throw new Error('User already exists');

    const hashedPassword = await hashPassword(password);

    return await this.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      role,
      profilePicturePath,
      isActive: true
    });
  }

  // Mise à jour dynamique du profil
  async updateProfile(userId, updates) {
    const updatesToApply = { ...updates };

    if (updates.newPassword) {
      updatesToApply.password = await hashPassword(updates.newPassword);
      delete updatesToApply.newPassword;
    }

    return await this.updateById(userId, updatesToApply);
  }

  // Soft delete
  async deactivateUser(userId) {
    return await this.softDelete(userId);
  }

  // Vérification du mot de passe
  async verifyUserPassword(plainPassword, hashedPassword) {
    return await verifyPassword(plainPassword, hashedPassword);
  }
}

module.exports = new UserModel();
