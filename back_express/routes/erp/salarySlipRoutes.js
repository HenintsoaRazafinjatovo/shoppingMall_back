const express = require('express');
const router = express.Router();
const SalarySlipController = require('../../controllers/erp/SalarySlipController');

// Routes CRUD de base
router.get('/', SalarySlipController.getAll.bind(SalarySlipController));
router.get('/:name', SalarySlipController.getOne.bind(SalarySlipController));
router.get('/:name/earnings', SalarySlipController.getEarnings.bind(SalarySlipController));
router.get('/:name/deductions', SalarySlipController.getDeductions.bind(SalarySlipController));
router.post('/search', SalarySlipController.search.bind(SalarySlipController));
router.post('/search-between-dates', SalarySlipController.searchBetweenDates.bind(SalarySlipController));
router.post('/search-by-creation-date', SalarySlipController.searchByCreationDate.bind(SalarySlipController));
router.post('/', SalarySlipController.create.bind(SalarySlipController));
router.put('/:name', SalarySlipController.update.bind(SalarySlipController));
router.delete('/:name', SalarySlipController.delete.bind(SalarySlipController));

// Routes spécifiques aux Salary Slips
router.get('/employee/:employee', SalarySlipController.getByEmployee.bind(SalarySlipController));
router.get('/payroll-entry/:payrollEntry', SalarySlipController.getByPayrollEntry.bind(SalarySlipController));
router.get('/status/:status', SalarySlipController.getByStatus.bind(SalarySlipController));
router.get('/date-range/range', SalarySlipController.getByDateRange.bind(SalarySlipController));
router.get('/department/:department', SalarySlipController.getByDepartment.bind(SalarySlipController));

module.exports = router;