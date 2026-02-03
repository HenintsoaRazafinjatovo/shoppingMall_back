const express = require('express');
const router = express.Router();
const SalesInvoiceController = require('../../controllers/erp/SalesInvoiceController');

// Routes CRUD de base
router.get('/', SalesInvoiceController.getAll.bind(SalesInvoiceController));
router.get('/:name', SalesInvoiceController.getOne.bind(SalesInvoiceController));
router.get('/:name/items', SalesInvoiceController.getRequiredItems.bind(SalesInvoiceController));
router.post('/search', SalesInvoiceController.search.bind(SalesInvoiceController));
router.post('/search-between-dates', SalesInvoiceController.searchBetweenDates.bind(SalesInvoiceController));
router.post('/search-by-creation-date', SalesInvoiceController.searchByCreationDate.bind(SalesInvoiceController));
router.post('/', SalesInvoiceController.create.bind(SalesInvoiceController));
router.put('/:name', SalesInvoiceController.update.bind(SalesInvoiceController));
router.delete('/:name', SalesInvoiceController.delete.bind(SalesInvoiceController));

// Routes spécifiques aux Purchase Invoices
router.get('/customer/:customerName', SalesInvoiceController.getByCustomer.bind(SalesInvoiceController));
router.get('/status/:status', SalesInvoiceController.getByStatus.bind(SalesInvoiceController));
router.get('/date-range/range', SalesInvoiceController.getByDateRange.bind(SalesInvoiceController));

module.exports = router;