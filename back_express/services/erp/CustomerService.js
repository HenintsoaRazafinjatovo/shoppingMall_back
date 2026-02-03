const CustomerRepository = require('../../repositories/erp/CustomerRepository');

const defaultFields = ['name', 'customer_name', 'customer_type', 'customer_group', 'territory', 'website', 'disabled', 'creation', 'modified']
class CustomerService {
  async getAllCustomers(fields = defaultFields) {
    return await CustomerRepository.getAll({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
  }

  async getCustomerByName(name, fields = defaultFields) {
    try {
      const results = await CustomerRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch customer ${name}: ${error.message}`);
    }
  }

  async searchCustomers(filters, fields = defaultFields) {
    return await CustomerRepository.search(filters, fields);
  }

  async searchCustomersBetweenDates(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await CustomerRepository.searchBetweenDates('creation', fromDate, toDate, extraFilters, fields);
  }

  async createCustomer(data) {
    return await CustomerRepository.create(data); 
  }

  async createAndSubmitCustomer(data) {
    return await CustomerRepository.createAndSubmit(data); 
  }

  async updateWithCancelAndSubmitCustomer(name, data) {
    return await CustomerRepository.updateWithCancelAndSubmit(name, data);
  }

  async updateCustomer(name, data) {
    return await CustomerRepository.update(name, data);
  }

  async deleteCustomer(name) {
    return await CustomerRepository.delete(name);
  }
}

module.exports = new CustomerService();