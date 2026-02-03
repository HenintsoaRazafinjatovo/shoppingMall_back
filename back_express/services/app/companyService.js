const Company = require('../../models/Company');

class CompanyService {
  constructor() {
    this.companyModel = new Company();
  }

  async createCompany(companyData) {
    try {
      return await this.companyModel.create(companyData);
    } catch (error) {
      throw new Error(`Error creating company: ${error.message}`);
    }
  }

  async getCompanyById(companyId) {
    try {
      const company = await this.companyModel.findById(companyId);
      if (!company) {
        throw new Error('Company not found');
      }
      return company;
    } catch (error) {
      throw new Error(`Error finding company by ID: ${error.message}`);
    }
  }

  async getCompanyByName(companyName) {
    try {
      const company = await this.companyModel.findByName(companyName);
      if (!company) {
        throw new Error('Company not found');
      }
      return company;
    } catch (error) {
      throw new Error(`Error finding company by name: ${error.message}`);
    }
  }

  async getAllCompanies(conditions = {}) {
    try {
      return await this.companyModel.findAll(conditions);
    } catch (error) {
      throw new Error(`Error fetching companies: ${error.message}`);
    }
  }

  async updateCompany(companyId, updates) {
    try {
      const company = await this.companyModel.update(companyId, updates);
      if (!company) {
        throw new Error('Company not found');
      }
      return company;
    } catch (error) {
      throw new Error(`Error updating company: ${error.message}`);
    }
  }

  async deleteCompany(companyId) {
    try {
      const company = await this.companyModel.softDelete(companyId);
      if (!company) {
        throw new Error('Company not found');
      }
      return { message: 'Company deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting company: ${error.message}`);
    }
  }

  async validateCompanyData(companyData) {
    const { companyName } = companyData;
    
    if (!companyName) {
      throw new Error('Company name is required');
    }

    if (companyName.length < 2) {
      throw new Error('Company name must be at least 2 characters long');
    }

    return true;
  }
}

module.exports = CompanyService;