const express = require('express');
const router = express.Router();
const TimesheetController = require('../../controllers/erp/TimesheetController');

// Routes de lecture
router.get('/', TimesheetController.getAll.bind(TimesheetController));
router.get('/task/:task', TimesheetController.getByTask.bind(TimesheetController));
router.get('/summary/employee/:employee/:fromDate/:toDate', TimesheetController.getEmployeeSummary.bind(TimesheetController));
router.get('/summary/project/:project/:fromDate/:toDate', TimesheetController.getProjectSummary.bind(TimesheetController));
router.get('/utilization/:employee/:fromDate/:toDate', TimesheetController.getUtilization.bind(TimesheetController));
router.get('/:name', TimesheetController.getOne.bind(TimesheetController));

// Routes de recherche
router.post('/search', TimesheetController.search.bind(TimesheetController));
router.post('/search-between-dates', TimesheetController.searchBetweenDates.bind(TimesheetController));
router.post('/search-with-stats', TimesheetController.searchWithStats.bind(TimesheetController));
router.post('/stats', TimesheetController.getStats.bind(TimesheetController));
router.post('/calculate-hours', TimesheetController.calculateHours.bind(TimesheetController));

// Routes de création
router.post('/', TimesheetController.create.bind(TimesheetController));
router.post('/bulk', TimesheetController.createBulk.bind(TimesheetController));
router.post('/import-timer', TimesheetController.importFromTimer.bind(TimesheetController));
router.post('/copy-previous', TimesheetController.copyPrevious.bind(TimesheetController));

// Routes de mise à jour
router.put('/:name', TimesheetController.update.bind(TimesheetController));
router.patch('/:name/status', TimesheetController.updateStatus.bind(TimesheetController));
router.patch('/bulk-approve', TimesheetController.approveBulk.bind(TimesheetController));
router.patch('/bulk-submit', TimesheetController.submitBulk.bind(TimesheetController));

// Routes de suppression
router.delete('/:name', TimesheetController.delete.bind(TimesheetController));

module.exports = router;