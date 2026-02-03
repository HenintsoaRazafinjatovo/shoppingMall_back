const CustomerService = require('../../services/erp/CustomerService');

class CustomerController {
  async getAll(req, res) {
    try {
      const { fields } = req.query;
      const customers = await CustomerService.getAllCustomers(fields);
      res.json(customers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const { fields } = req.query;
      const customer = await CustomerService.getCustomerByName(req.params.name, fields);
      
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(customer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const customers = await CustomerService.searchCustomers(filters, fields);
      res.json(customers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const customers = await CustomerService.searchCustomersBetweenDates(fromDate, toDate, extraFilters, fields);
      res.json(customers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const customer = await CustomerService.createCustomer(req.body);
      res.json(customer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const customer = await CustomerService.updateCustomer(req.params.name, req.body);
      res.json(customer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await CustomerService.deleteCustomer(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new CustomerController();