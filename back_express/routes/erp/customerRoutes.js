const express = require('express');
const router = express.Router();
const CustomerController = require('../../controllers/erp/CustomerController');

router.get('/', CustomerController.getAll.bind(CustomerController));
router.get('/:name', CustomerController.getOne.bind(CustomerController));
router.post('/search', CustomerController.search.bind(CustomerController));
router.post('/search-between-dates', CustomerController.searchBetweenDates.bind(CustomerController));
router.post('/', CustomerController.create.bind(CustomerController));
router.put('/:name', CustomerController.update.bind(CustomerController));
router.delete('/:name', CustomerController.delete.bind(CustomerController));

module.exports = router;