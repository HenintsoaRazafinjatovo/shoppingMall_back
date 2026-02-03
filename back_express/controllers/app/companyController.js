const CompanyService = require('../../services/app/companyService');

class CompanyController {
  constructor() {
    this.companyService = new CompanyService();
  }

  createCompany = async (req, res) => {
    try {
      const companyData = req.body;
      
      // Validation des données
      await this.companyService.validateCompanyData(companyData);
      
      const company = await this.companyService.createCompany(companyData);
      
      res.status(201).json({
        success: true,
        message: 'Company created successfully',
        data: company
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  getCompanyById = async (req, res) => {
    try {
      const { id } = req.params;
      const company = await this.companyService.getCompanyById(id);
      
      res.status(200).json({
        success: true,
        data: company
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  };

  getCompanyByName = async (req, res) => {
    try {
      const { name } = req.query;
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Company name parameter is required'
        });
      }

      const company = await this.companyService.getCompanyByName(name);
      
      res.status(200).json({
        success: true,
        data: company
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  };

  getAllCompanies = async (req, res) => {
    try {
      const { is_active } = req.query;
      const conditions = {};
      
      if (is_active !== undefined) {
        conditions.is_active = is_active === 'true';
      }

      const companies = await this.companyService.getAllCompanies(conditions);
      
      res.status(200).json({
        success: true,
        count: companies.length,
        data: companies
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  updateCompany = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const updatedCompany = await this.companyService.updateCompany(id, updates);
      
      res.status(200).json({
        success: true,
        message: 'Company updated successfully',
        data: updatedCompany
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  deleteCompany = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.companyService.deleteCompany(id);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  validateCompany = async (req, res) => {
    try {
      const companyData = req.body;
      await this.companyService.validateCompanyData(companyData);
      
      res.status(200).json({
        success: true,
        message: 'Company data is valid'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
}

module.exports = CompanyController;