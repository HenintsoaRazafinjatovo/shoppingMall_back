const express = require('express');
const router = express.Router();
const BinController = require('../../controllers/erp/BinController');

// Routes CRUD de base
router.get('/', BinController.getAll.bind(BinController));
router.get('/:name', BinController.getOne.bind(BinController));
router.post('/search', BinController.search.bind(BinController));
router.post('/search-between-dates', BinController.searchBetweenDates.bind(BinController));
router.post('/search-by-modified-date', BinController.searchByModifiedDate.bind(BinController));
router.post('/', BinController.create.bind(BinController));
router.put('/:name', BinController.update.bind(BinController));
router.delete('/:name', BinController.delete.bind(BinController));

// Routes spécifiques aux Bins
router.get('/item/:itemCode', BinController.getByItemCode.bind(BinController));
router.get('/warehouse/:warehouse', BinController.getByWarehouse.bind(BinController));
router.get('/item/:itemCode/warehouse/:warehouse', BinController.getByItemAndWarehouse.bind(BinController));
router.get('/stock/low-stock', BinController.getLowStock.bind(BinController));
router.get('/stock/zero-stock', BinController.getZeroStock.bind(BinController));
router.get('/batch/:batchNo', BinController.getByBatch.bind(BinController));
router.get('/serial/:serialNo', BinController.getBySerial.bind(BinController));
router.get('/expiring/expiring-before', BinController.getExpiringBefore.bind(BinController));
router.get('/warehouse/:warehouse/stock-value', BinController.getStockValueByWarehouse.bind(BinController));
router.get('/item/:itemCode/stock-summary', BinController.getStockSummaryByItem.bind(BinController));

module.exports = router;