const express = require('express');
const router = express.Router();
const ItemController = require('../../controllers/erp/ItemController');

router.get('/', ItemController.getAll.bind(ItemController));
router.get('/:name', ItemController.getOne.bind(ItemController));
router.post('/search', ItemController.search.bind(ItemController));
router.post('/search-between-dates', ItemController.searchBetweenDates.bind(ItemController));
router.post('/', ItemController.create.bind(ItemController));
router.put('/:name', ItemController.update.bind(ItemController));
router.delete('/:name', ItemController.delete.bind(ItemController));

module.exports = router;
