const express = require('express');
const router = express.Router();
const BOMController = require('../../controllers/erp/BOMController');

// Routes principales
router.get('/', BOMController.getAll.bind(BOMController));
router.get('/:name', BOMController.getOne.bind(BOMController));
router.get('/item/:item', BOMController.getByItem.bind(BOMController));
router.get('/item/:item/default', BOMController.getDefaultByItem.bind(BOMController));
router.get('/:name/items', BOMController.getBOMItems.bind(BOMController));
router.get('/:name/operations', BOMController.getBOMOperations.bind(BOMController));

// Routes de recherche
router.post('/search', BOMController.search.bind(BOMController));
router.post('/search-between-dates', BOMController.searchBetweenDates.bind(BOMController));

// Routes CRUD
router.post('/', BOMController.create.bind(BOMController));
router.put('/:name', BOMController.update.bind(BOMController));
router.delete('/:name', BOMController.delete.bind(BOMController));

module.exports = router;