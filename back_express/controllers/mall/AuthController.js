  const UserModel = require('../../models/UserModel');
const { generateTokens, verifyRefreshToken } = require('../../utils/jwt');

class AuthController {

  // LOGIN
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      if (!user.isActive)
        return res.status(403).json({ message: "Account disabled" });

      const valid = await UserModel.verifyUserPassword(password, user.password);
      if (!valid)
        return res.status(401).json({ message: "Invalid credentials" });

      const payload = {
        id: user._id,
        role: user.role,
        email: user.email
      };

      const tokens = generateTokens(payload);

      res.json({
        ...tokens,
        user: {
          _id: user._id,
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          boutiqueId: user.boutiqueId || null
        }
      });

    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // REFRESH TOKEN
  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken)
        return res.status(401).json({ message: "Missing refresh token" });

      const decoded = verifyRefreshToken(refreshToken);

      const tokens = generateTokens({
        id: decoded.id,
        role: decoded.role,
        email: decoded.email
      });

      res.json(tokens);

    } catch (err) {
      res.status(401).json({ message: "Invalid refresh token" });
    }
  }
  async register(req, res) {
    try {
      const user = await UserModel.createUser(req.body);
      
      // Si c'est un MANAGER, créer automatiquement une boutique
      let boutiqueId = null;
      if (user.role === 'MANAGER') {
        const Boutique = require('../../models/Boutique');
        const boutique = await Boutique.create({
          name: `Boutique de ${user.fullName}`,
          description: '',
          logo: '',
          ownerId: user._id,
          isValidated: false
        });
        boutiqueId = boutique._id;
        // Mettre à jour l'utilisateur avec son boutiqueId
        await UserModel.updateById(user._id, { boutiqueId: boutique._id });
      }
      
      // Générer les tokens pour connexion automatique
      const payload = {
        id: user._id,
        role: user.role,
        email: user.email
      };
      const tokens = generateTokens(payload);

      res.status(201).json({
        success: true,
        ...tokens,
        user: {
          _id: user._id,
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          boutiqueId: boutiqueId
        }
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }


}

module.exports = new AuthController();
