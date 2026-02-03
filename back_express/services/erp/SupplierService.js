const SupplierRepository = require('../../repositories/erp/SupplierRepository');

const defaultFields = ['name', 'supplier_name', 'supplier_type', 'supplier_group', 'country', 'website', 'disabled', 'creation', 'modified']
class SupplierService {
  async getAllSuppliers(fields = defaultFields) {
    return await SupplierRepository.getAll({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
  }

  async getSupplierByName(name, fields = defaultFields) {
    try {
      const results = await SupplierRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch supplier ${name}: ${error.message}`);
    }
  }

  async searchSuppliers(filters, fields = defaultFields) {
    return await SupplierRepository.search(filters, fields);
  }

  async searchSuppliersBetweenDates(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await SupplierRepository.searchBetweenDates('creation', fromDate, toDate, extraFilters, fields);
  }

  async createSupplier(data) {
    return await SupplierRepository.create(data); 
  }

  async createAndSubmitSupplier(data) {
    return await SupplierRepository.createAndSubmit(data); 
  }

  async updateWithCancelAndSubmitSupplier(name, data) {
    return await SupplierRepository.updateWithCancelAndSubmit(name, data);
  }

  async updateSupplier(name, data) {
    return await SupplierRepository.update(name, data);
  }

  async deleteSupplier(name) {
    return await SupplierRepository.delete(name);
  }
}

module.exports = new SupplierService();