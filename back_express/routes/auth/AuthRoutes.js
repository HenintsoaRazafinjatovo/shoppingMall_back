const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/AuthController');
const { extractToken } = require('../../middleware/auth');

// Inscription
router.post('/signup', authController.signup);
router.post('/signup/complete', authController.completeSignup);

// Connexion/Déconnexion
router.post('/login', authController.login);
router.post('/logout', extractToken, authController.logout);

// Rafraîchissement token
router.post('/refresh', authController.refreshToken);

module.exports = router;