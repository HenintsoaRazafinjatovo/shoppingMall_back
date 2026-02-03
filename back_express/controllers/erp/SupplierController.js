const SupplierService = require('../../services/erp/SupplierService');

class SupplierController {
  async getAll(req, res) {
    try {
      const { fields } = req.query;
      const suppliers = await SupplierService.getAllSuppliers(fields);
      res.json(suppliers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const { fields } = req.query;
      const supplier = await SupplierService.getSupplierByName(req.params.name, fields);
      
      if (!supplier) {
        return res.status(404).json({ error: 'Supplier not found' });
      }
      res.json(supplier);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const suppliers = await SupplierService.searchSuppliers(filters, fields);
      res.json(suppliers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const suppliers = await SupplierService.searchSuppliersBetweenDates(fromDate, toDate, extraFilters, fields);
      res.json(suppliers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const supplier = await SupplierService.createSupplier(req.body);
      res.json(supplier);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const supplier = await SupplierService.updateSupplier(req.params.name, req.body);
      res.json(supplier);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await SupplierService.deleteSupplier(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new SupplierController();