const express = require('express');
const router = express.Router();
const WorkOrderController = require('../../controllers/erp/WorkOrderController');

// Routes de lecture
router.get('/', WorkOrderController.getAll.bind(WorkOrderController));
router.get('/item/:item', WorkOrderController.getByItem.bind(WorkOrderController));
router.get('/bom/:bomNo', WorkOrderController.getByBOM.bind(WorkOrderController));
router.get('/:name', WorkOrderController.getOne.bind(WorkOrderController));
router.get('/:name/items', WorkOrderController.getRequiredItems.bind(WorkOrderController));
router.get('/:name/progress', WorkOrderController.getProgress.bind(WorkOrderController));

// Routes de recherche
router.post('/search', WorkOrderController.search.bind(WorkOrderController));
router.post('/search-between-dates', WorkOrderController.searchBetweenDates.bind(WorkOrderController));
router.post('/search-with-stats', WorkOrderController.searchWithStats.bind(WorkOrderController));
router.post('/stats', WorkOrderController.getStats.bind(WorkOrderController));

// Routes de création
router.post('/', WorkOrderController.create.bind(WorkOrderController));
router.post('/from-bom', WorkOrderController.createFromBOM.bind(WorkOrderController));

// Routes de mise à jour
router.put('/:name', WorkOrderController.update.bind(WorkOrderController));
router.patch('/:name/status', WorkOrderController.updateStatus.bind(WorkOrderController));

// Routes de suppression
router.delete('/:name', WorkOrderController.delete.bind(WorkOrderController));

module.exports = router;