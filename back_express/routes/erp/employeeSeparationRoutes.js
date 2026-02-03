const express = require('express');
const router = express.Router();
const EmployeeSeparationController = require('../../controllers/erp/EmployeeSeparationController');

// Routes de lecture
router.get('/', EmployeeSeparationController.getAll.bind(EmployeeSeparationController));
router.get('/employee/:employee', EmployeeSeparationController.getByEmployee.bind(EmployeeSeparationController));
router.get('/department/:department', EmployeeSeparationController.getByDepartment.bind(EmployeeSeparationController));
router.get('/:name', EmployeeSeparationController.getOne.bind(EmployeeSeparationController));
router.get('/:name/timeline', EmployeeSeparationController.getTimeline.bind(EmployeeSeparationController));
router.get('/:name/clearance', EmployeeSeparationController.getClearance.bind(EmployeeSeparationController));
router.get('/:name/notice-period', EmployeeSeparationController.getNoticePeriod.bind(EmployeeSeparationController));

// Routes de recherche
router.post('/search', EmployeeSeparationController.search.bind(EmployeeSeparationController));
router.post('/search-between-dates', EmployeeSeparationController.searchBetweenDates.bind(EmployeeSeparationController));
router.post('/search-with-stats', EmployeeSeparationController.searchWithStats.bind(EmployeeSeparationController));
router.post('/stats', EmployeeSeparationController.getStats.bind(EmployeeSeparationController));

// Routes de création
router.post('/', EmployeeSeparationController.create.bind(EmployeeSeparationController));
router.post('/from-resignation', EmployeeSeparationController.createFromResignation.bind(EmployeeSeparationController));

// Routes de mise à jour
router.put('/:name', EmployeeSeparationController.update.bind(EmployeeSeparationController));
router.patch('/:name/status', EmployeeSeparationController.updateStatus.bind(EmployeeSeparationController));
router.patch('/:name/initiate-exit', EmployeeSeparationController.initiateExitProcess.bind(EmployeeSeparationController));

// Routes de suppression
router.delete('/:name', EmployeeSeparationController.delete.bind(EmployeeSeparationController));

module.exports = router;