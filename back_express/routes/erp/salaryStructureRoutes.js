const express = require('express');
const router = express.Router();
const SalaryStructureController = require('../../controllers/erp/SalaryStructureController');

// Routes CRUD de base
router.get('/', SalaryStructureController.getAll.bind(SalaryStructureController));
router.get('/:name', SalaryStructureController.getOne.bind(SalaryStructureController));
router.get('/:name/earnings', SalaryStructureController.getEarnings.bind(SalaryStructureController));
router.get('/:name/deductions', SalaryStructureController.getDeductions.bind(SalaryStructureController));
router.post('/search', SalaryStructureController.search.bind(SalaryStructureController));
router.post('/search-between-dates', SalaryStructureController.searchBetweenDates.bind(SalaryStructureController));
router.post('/search-by-creation-date', SalaryStructureController.searchByCreationDate.bind(SalaryStructureController));
router.post('/', SalaryStructureController.create.bind(SalaryStructureController));
router.put('/:name', SalaryStructureController.update.bind(SalaryStructureController));
router.delete('/:name', SalaryStructureController.delete.bind(SalaryStructureController));

// Routes spécifiques aux Salary Structures
router.get('/employee/:employee', SalaryStructureController.getByEmployee.bind(SalaryStructureController));
router.get('/company/:company', SalaryStructureController.getByCompany.bind(SalaryStructureController));
router.get('/department/:department', SalaryStructureController.getByDepartment.bind(SalaryStructureController));
router.get('/designation/:designation', SalaryStructureController.getByDesignation.bind(SalaryStructureController));
router.get('/status/:status', SalaryStructureController.getByStatus.bind(SalaryStructureController));
router.get('/is-active/:isActive', SalaryStructureController.getByActiveStatus.bind(SalaryStructureController));
router.get('/date-range/range', SalaryStructureController.getByDateRange.bind(SalaryStructureController));
router.post('/assign-to-employees', SalaryStructureController.assignToEmployees.bind(SalaryStructureController));

module.exports = router;