const express = require('express');
const UserController = require('../../controllers/app/userController');

const router = express.Router();
const userController = new UserController();

// Routes pour les utilisateurs
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/email', userController.getUserByEmail);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUserProfile);
router.delete('/users/:id', userController.deleteUser);
router.post('/users/verify-password', userController.verifyPassword);

module.exports = router;