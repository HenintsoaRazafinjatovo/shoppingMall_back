const PurchaseInvoiceService = require('../../services/erp/PurchaseInvoiceService');

class PurchaseInvoiceController {
  async getAll(req, res) {
    try {
      const { fields } = req.query;
      const purchaseInvoices = await PurchaseInvoiceService.getAllPurchaseInvoices(fields);
      res.json(purchaseInvoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const { fields } = req.query;
      const purchaseInvoice = await PurchaseInvoiceService.getPurchaseInvoiceByName(req.params.name, fields);
      
      if (!purchaseInvoice) {
        return res.status(404).json({ error: 'Purchase invoice not found' });
      }
      res.json(purchaseInvoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const purchaseInvoices = await PurchaseInvoiceService.searchPurchaseInvoices(filters, fields);
      res.json(purchaseInvoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const purchaseInvoices = await PurchaseInvoiceService.searchPurchaseInvoicesBetweenDates(fromDate, toDate, extraFilters, fields);
      res.json(purchaseInvoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchByCreationDate(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const purchaseInvoices = await PurchaseInvoiceService.searchPurchaseInvoicesByCreationDate(fromDate, toDate, extraFilters, fields);
      res.json(purchaseInvoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const purchaseInvoice = await PurchaseInvoiceService.createPurchaseInvoice(req.body);
      res.status(201).json(purchaseInvoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const purchaseInvoice = await PurchaseInvoiceService.updatePurchaseInvoice(req.params.name, req.body);
      res.json(purchaseInvoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await PurchaseInvoiceService.deletePurchaseInvoice(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Routes spécifiques aux Purchase Invoices
  async getBySupplier(req, res) {
    try {
      const { fields } = req.query;
      const purchaseInvoices = await PurchaseInvoiceService.getPurchaseInvoicesBySupplier(req.params.supplierName, fields);
      res.json(purchaseInvoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByStatus(req, res) {
    try {
      const { fields } = req.query;
      const purchaseInvoices = await PurchaseInvoiceService.getPurchaseInvoicesByStatus(req.params.status, fields);
      res.json(purchaseInvoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByDateRange(req, res) {
    try {
      const { fromDate, toDate, fields } = req.query;
      const purchaseInvoices = await PurchaseInvoiceService.getPurchaseInvoicesByDateRange(fromDate, toDate, fields);
      res.json(purchaseInvoices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getRequiredItems(req, res) {
      try {
        const { name } = req.params;
        const items = await PurchaseInvoiceService.getPurchaseInvoiceRequiredItems(name);
        res.json(items);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }

}

module.exports = new PurchaseInvoiceController();   