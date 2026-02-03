const express = require('express');
const router = express.Router();
const SupplierController = require('../../controllers/erp/SupplierController');

router.get('/', SupplierController.getAll.bind(SupplierController));
router.get('/:name', SupplierController.getOne.bind(SupplierController));
router.post('/search', SupplierController.search.bind(SupplierController));
router.post('/search-between-dates', SupplierController.searchBetweenDates.bind(SupplierController));
router.post('/', SupplierController.create.bind(SupplierController));
router.put('/:name', SupplierController.update.bind(SupplierController));
router.delete('/:name', SupplierController.delete.bind(SupplierController));

module.exports = router;