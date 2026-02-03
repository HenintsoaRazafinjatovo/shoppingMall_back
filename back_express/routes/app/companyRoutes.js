const express = require('express');
const CompanyController = require('../../controllers/app/companyController');

const router = express.Router();
const companyController = new CompanyController();

// Routes pour les companies
router.post('/companies', companyController.createCompany);
router.get('/companies', companyController.getAllCompanies);
router.get('/companies/name', companyController.getCompanyByName);
router.get('/companies/:id', companyController.getCompanyById);
router.put('/companies/:id', companyController.updateCompany);
router.delete('/companies/:id', companyController.deleteCompany);
router.post('/companies/validate', companyController.validateCompany);

module.exports = router;