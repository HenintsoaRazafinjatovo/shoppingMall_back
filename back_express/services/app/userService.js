const User = require('../../models/User');

class UserService {
  constructor() {
    this.userModel = new User();
  }

  async createUser(userData) {
    try {
      return await this.userModel.create(userData);
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await this.userModel.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  async getUserById(userId) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`);
    }
  }

  async getAllUsers(conditions = {}) {
    try {
      return await this.userModel.findAll(conditions);
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  async updateUserProfile(userId, updates) {
    try {
      const user = await this.userModel.updateProfile_v2(userId, updates);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Error updating user profile: ${error.message}`);
    }
  }

  async deleteUser(userId) {
    try {
      const user = await this.userModel.softDelete(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  async verifyUserPassword(email, password) {
    try {
      const user = await this.userModel.findByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await this.userModel.verifyPassword(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      return { isValid: true, user: { ...user, password_hash: undefined } };
    } catch (error) {
      throw new Error(`Error verifying password: ${error.message}`);
    }
  }
}

module.exports = UserService;