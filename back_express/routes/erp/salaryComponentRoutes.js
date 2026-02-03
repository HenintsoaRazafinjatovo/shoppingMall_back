const express = require('express');
const router = express.Router();
const SalaryComponentController = require('../../controllers/erp/SalaryComponentController');

// Routes CRUD de base
router.get('/', SalaryComponentController.getAll.bind(SalaryComponentController));
router.get('/:name', SalaryComponentController.getOne.bind(SalaryComponentController));
router.post('/search', SalaryComponentController.search.bind(SalaryComponentController));
router.post('/search-between-dates', SalaryComponentController.searchBetweenDates.bind(SalaryComponentController));
router.post('/search-by-creation-date', SalaryComponentController.searchByCreationDate.bind(SalaryComponentController));
router.post('/', SalaryComponentController.create.bind(SalaryComponentController));
router.put('/:name', SalaryComponentController.update.bind(SalaryComponentController));
router.delete('/:name', SalaryComponentController.delete.bind(SalaryComponentController));

// Routes spécifiques aux Salary Components
router.get('/type/:type', SalaryComponentController.getByType.bind(SalaryComponentController));
router.get('/category/:category', SalaryComponentController.getByCategory.bind(SalaryComponentController));
router.get('/is-active/:isActive', SalaryComponentController.getByActiveStatus.bind(SalaryComponentController));
router.get('/company/:company', SalaryComponentController.getByCompany.bind(SalaryComponentController));
router.get('/frequency/:frequency', SalaryComponentController.getByFrequency.bind(SalaryComponentController));
router.post('/bulk-create', SalaryComponentController.bulkCreate.bind(SalaryComponentController));
router.get('/:name/usage', SalaryComponentController.getComponentUsage.bind(SalaryComponentController));
router.get('/:name/structures', SalaryComponentController.getStructuresUsingComponent.bind(SalaryComponentController));

module.exports = router;