const express = require('express');
const router = express.Router();
const EmployeeController = require('../../controllers/erp/EmployeeController');

// Routes de lecture
router.get('/', EmployeeController.getAll.bind(EmployeeController));
router.get('/employee-id/:employeeId', EmployeeController.getByEmployeeId.bind(EmployeeController));
router.get('/manager/:managerId', EmployeeController.getByManager.bind(EmployeeController));
router.get('/branch/:branch', EmployeeController.getByBranch.bind(EmployeeController));
router.get('/department/:department/summary', EmployeeController.getDepartmentSummary.bind(EmployeeController));
router.get('/birthdays/:month', EmployeeController.getBirthdays.bind(EmployeeController));
router.get('/anniversaries/:month', EmployeeController.getAnniversaries.bind(EmployeeController));
router.get('/:name', EmployeeController.getOne.bind(EmployeeController));
router.get('/:name/tenure', EmployeeController.getTenure.bind(EmployeeController));
router.get('/:name/leave-balance', EmployeeController.getLeaveBalance.bind(EmployeeController));

// Routes de recherche
router.post('/search', EmployeeController.search.bind(EmployeeController));
router.post('/search-between-dates', EmployeeController.searchBetweenDates.bind(EmployeeController));
router.post('/search-with-stats', EmployeeController.searchWithStats.bind(EmployeeController));
router.post('/stats', EmployeeController.getStats.bind(EmployeeController));

// Routes de création
router.post('/', EmployeeController.create.bind(EmployeeController));
router.post('/with-user', EmployeeController.createWithUser.bind(EmployeeController));
router.post('/from-applicant', EmployeeController.createFromApplicant.bind(EmployeeController));

// Routes de mise à jour
router.put('/:name', EmployeeController.update.bind(EmployeeController));
router.patch('/:name/contact-info', EmployeeController.updateContactInfo.bind(EmployeeController));
router.patch('/:name/bank-details', EmployeeController.updateBankDetails.bind(EmployeeController));
router.patch('/:name/status', EmployeeController.updateStatus.bind(EmployeeController));

// Routes de suppression
router.delete('/:name', EmployeeController.delete.bind(EmployeeController));

module.exports = router;