const express = require('express');
const router = express.Router();
const PurchaseInvoiceController = require('../../controllers/erp/PurchaseInvoiceController');

// Routes CRUD de base
router.get('/', PurchaseInvoiceController.getAll.bind(PurchaseInvoiceController));
router.get('/:name', PurchaseInvoiceController.getOne.bind(PurchaseInvoiceController));
router.get('/:name/items', PurchaseInvoiceController.getRequiredItems.bind(PurchaseInvoiceController));
router.post('/search', PurchaseInvoiceController.search.bind(PurchaseInvoiceController));
router.post('/search-between-dates', PurchaseInvoiceController.searchBetweenDates.bind(PurchaseInvoiceController));
router.post('/search-by-creation-date', PurchaseInvoiceController.searchByCreationDate.bind(PurchaseInvoiceController));
router.post('/', PurchaseInvoiceController.create.bind(PurchaseInvoiceController));
router.put('/:name', PurchaseInvoiceController.update.bind(PurchaseInvoiceController));
router.delete('/:name', PurchaseInvoiceController.delete.bind(PurchaseInvoiceController));

// Routes spécifiques aux Purchase Invoices
router.get('/supplier/:supplierName', PurchaseInvoiceController.getBySupplier.bind(PurchaseInvoiceController));
router.get('/status/:status', PurchaseInvoiceController.getByStatus.bind(PurchaseInvoiceController));
router.get('/date-range/range', PurchaseInvoiceController.getByDateRange.bind(PurchaseInvoiceController));

module.exports = router;