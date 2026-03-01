const User = require('../../models/User');
const bcrypt = require('bcrypt');

class UserController {
  // Get all users
  getAllUsers = async (req, res) => {
    try {
      const users = await User.find({ isActive: true })
        .select('-password')
        .sort({ createdAt: -1 });
      
      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get user by ID
  getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Create user
  createUser = async (req, res) => {
    try {
      const { fullName, email, password, role, phone } = req.body;

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password || '12345678', 10);

      const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        role: role || 'USER',
        phone: phone || ''
      });

      // Return without password
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: userResponse
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // Update user
  updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { fullName, email, role, phone, password } = req.body;

      const updateData = { fullName, email, role, phone };

      // If password is provided, hash it
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }

      res.status(200).json({
        success: true,
        message: 'Utilisateur mis à jour',
        data: user
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // Delete user (soft delete)
  deleteUser = async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });

      if (!user) {
        return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
      }

      res.status(200).json({
        success: true,
        message: 'Utilisateur supprimé'
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // Search users
  searchUsers = async (req, res) => {
    try {
      const { q, role } = req.query;
      const filter = { isActive: true };

      if (q) {
        filter.$or = [
          { fullName: new RegExp(q, 'i') },
          { email: new RegExp(q, 'i') }
        ];
      }

      if (role && role !== 'all') {
        filter.role = role;
      }

      const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = UserController;
