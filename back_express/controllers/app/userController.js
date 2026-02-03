const UserService = require('../../services/app/userService');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req, res) => {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  };

  getUserByEmail = async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email parameter is required'
        });
      }

      const user = await this.userService.getUserByEmail(email);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  };

  getAllUsers = async (req, res) => {
    try {
      const { is_active } = req.query;
      const conditions = {};
      
      if (is_active !== undefined) {
        conditions.is_active = is_active === 'true';
      }

      const users = await this.userService.getAllUsers(conditions);
      
      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  updateUserProfile = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedUser = await this.userService.updateUserProfile(id, updates);
      
      res.status(200).json({
        success: true,
        message: 'User profile updated successfully',
        data: updatedUser
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.userService.deleteUser(id);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  verifyPassword = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await this.userService.verifyUserPassword(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Password verified successfully',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  };
}

module.exports = UserController;