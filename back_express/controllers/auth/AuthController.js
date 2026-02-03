const AuthService = require('../../services/auth/AuthService');

// ----------------------------
// Inscription étape 1
// ----------------------------
exports.signup = async (req, res) => {
  try {
    const authService = new AuthService();
    const result = await authService.signup(req.body);

    if (!result.success) {
      return res.status(409).json({ 
        success: false,
        message: result.error 
      });
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      requiresCompany: result.requiresCompany
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ----------------------------
// Inscription étape 2 - Création entreprise
// ----------------------------
exports.completeSignup = async (req, res) => {
  try {
    const { userId, companyData } = req.body;
    const authService = new AuthService();
    const result = await authService.completeSignup(userId, companyData);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      user: result.user,
      company: result.company,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      completed: true
    });

  } catch (error) {
    console.error('Complete signup error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ----------------------------
// Connexion
// ----------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const authService = new AuthService();
    const result = await authService.login(email, password);

    if (!result.success) {
      return res.status(401).json({ success: false, message: result.error });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: result.data.user,
      company: result.data.company,
      requiresCompany: result.data.requiresCompany,
      accessToken: result.data.tokens.accessToken,
      refreshToken: result.data.tokens.refreshToken
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ----------------------------
// Déconnexion
// ----------------------------
exports.logout = async (req, res) => {
  try {
    const authService = new AuthService();

    // Récupère le token depuis Authorization header
    const token = req.token || (req.headers.authorization?.split(' ')[1]);
    if (!token) {
      return res.status(400).json({ success: false, message: 'Access token required' });
    }

    const result = await authService.logout(token);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }

    res.json({ success: true, message: 'Logout successful' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ----------------------------
// Rafraîchissement des tokens
// ----------------------------
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    const authService = new AuthService();
    const result = await authService.refreshTokens(refreshToken);

    if (!result.success) {
      return res.status(401).json({ success: false, message: result.error });
    }

    res.json({
      success: true,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
