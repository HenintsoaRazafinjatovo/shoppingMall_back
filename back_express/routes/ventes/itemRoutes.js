const express = require('express');
const router = express.Router();
const itemController = require('../../controllers/ventes/itemController');

router.get('/get', itemController.getItems);
router.post('/', itemController.createItem);
router.get('/:name', itemController.getItemByName);

module.exports = router;
