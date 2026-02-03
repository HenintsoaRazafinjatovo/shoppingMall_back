const SalesInvoiceService = require('../../services/erp/SalesInvoiceService');

class SalesInvoiceController {
  async getAll(req, res) {
    try {
      const { fields } = req.query;
      const salesInvoices = await SalesInvoiceService.getAllSalesInvoices(fields);
      res.json(salesInvoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const { fields } = req.query;
      const salesInvoice = await SalesInvoiceService.getSalesInvoiceByName(req.params.name, fields);
      
      if (!salesInvoice) {
        return res.status(404).json({ error: 'Sales invoice not found' });
      }
      res.json(salesInvoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const salesInvoices = await SalesInvoiceService.searchSalesInvoices(filters, fields);
      res.json(salesInvoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const salesInvoices = await SalesInvoiceService.searchSalesInvoicesBetweenDates(fromDate, toDate, extraFilters, fields);
      res.json(salesInvoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchByCreationDate(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const salesInvoices = await SalesInvoiceService.searchSalesInvoicesByCreationDate(fromDate, toDate, extraFilters, fields);
      res.json(salesInvoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const salesInvoice = await SalesInvoiceService.createSalesInvoice(req.body);
      res.status(201).json(salesInvoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const salesInvoice = await SalesInvoiceService.updateSalesInvoice(req.params.name, req.body);
      res.json(salesInvoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await SalesInvoiceService.deleteWithCancelSalesInvoice(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Routes spécifiques aux Sales Invoices
  async getByCustomer(req, res) {
    try {
      const { fields } = req.query;
      const salesInvoices = await SalesInvoiceService.getSalesInvoicesByCustomer(req.params.customerName, fields);
      res.json(salesInvoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByStatus(req, res) {
    try {
      const { fields } = req.query;
      const salesInvoices = await SalesInvoiceService.getSalesInvoicesByStatus(req.params.status, fields);
      res.json(salesInvoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByDateRange(req, res) {
    try {
      const { fromDate, toDate, fields } = req.query;
      const salesInvoices = await SalesInvoiceService.getSalesInvoicesByDateRange(fromDate, toDate, fields);
      res.json(salesInvoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getRequiredItems(req, res) {
      try {
        const { name } = req.params;
        const items = await SalesInvoiceService.getSalesInvoiceRequiredItems(name);
        res.json(items);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }

}

module.exports = new SalesInvoiceController();   