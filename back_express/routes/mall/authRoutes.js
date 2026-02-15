const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/mall/AuthController');

router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/register', AuthController.register);


module.exports = router;
