const express = require('express');
const router = express.Router();
const AttendanceController = require('../../controllers/erp/AttendanceController');

// Routes de lecture
router.get('/', AttendanceController.getAll.bind(AttendanceController));
router.get('/employee/:employee', AttendanceController.getByEmployee.bind(AttendanceController));
router.get('/department/:department', AttendanceController.getByDepartment.bind(AttendanceController));
router.get('/summary/monthly/:employee/:year/:month', AttendanceController.getMonthlySummary.bind(AttendanceController));
router.get('/summary/daily/:department/:date', AttendanceController.getDailySummary.bind(AttendanceController));
router.get('/:name', AttendanceController.getOne.bind(AttendanceController));
router.get('/:name/working-hours', AttendanceController.calculateWorkingHours.bind(AttendanceController));

// Routes de recherche
router.post('/search', AttendanceController.search.bind(AttendanceController));
router.post('/search-between-dates', AttendanceController.searchBetweenDates.bind(AttendanceController));
router.post('/search-with-stats', AttendanceController.searchWithStats.bind(AttendanceController));
router.post('/stats', AttendanceController.getStats.bind(AttendanceController));
router.post('/calculate-late-hours/:name', AttendanceController.calculateLateHours.bind(AttendanceController));

// Routes de création
router.post('/', AttendanceController.create.bind(AttendanceController));
router.post('/bulk', AttendanceController.createBulk.bind(AttendanceController));
router.post('/mark-present', AttendanceController.markPresent.bind(AttendanceController));
router.post('/mark-absent', AttendanceController.markAbsent.bind(AttendanceController));
router.post('/mark-half-day', AttendanceController.markHalfDay.bind(AttendanceController));
router.post('/import-biometric', AttendanceController.importBiometric.bind(AttendanceController));

// Routes de mise à jour
router.put('/:name', AttendanceController.update.bind(AttendanceController));
router.patch('/:name/regularize', AttendanceController.regularize.bind(AttendanceController));

// Routes de suppression
router.delete('/:name', AttendanceController.delete.bind(AttendanceController));

module.exports = router;