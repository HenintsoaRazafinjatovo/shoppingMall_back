const BinService = require('../../services/erp/BinService');

class BinController {
  async getAll(req, res) {
    try {
      const { fields } = req.query;
      const bins = await BinService.getAllBins(fields);
      res.json(bins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const { fields } = req.query;
      const bin = await BinService.getBinByName(req.params.name, fields);
      
      if (!bin) {
        return res.status(404).json({ error: 'Bin not found' });
      }
      res.json(bin);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const bins = await BinService.searchBins(filters, fields);
      res.json(bins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const bins = await BinService.searchBinsBetweenDates(fromDate, toDate, extraFilters, fields);
      res.json(bins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchByModifiedDate(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const bins = await BinService.searchBinsByModifiedDate(fromDate, toDate, extraFilters, fields);
      res.json(bins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const bin = await BinService.createBin(req.body);
      res.status(201).json(bin);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const bin = await BinService.updateBin(req.params.name, req.body);
      res.json(bin);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await BinService.deleteBin(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Routes spécifiques aux Bins
  async getByItemCode(req, res) {
    try {
      const { fields } = req.query;
      const bins = await BinService.getBinsByItemCode(req.params.itemCode, fields);
      res.json(bins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByWarehouse(req, res) {
    try {
      const { fields } = req.query;
      const bins = await BinService.getBinsByWarehouse(req.params.warehouse, fields);
      res.json(bins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByItemAndWarehouse(req, res) {
    try {
      const { fields } = req.query;
      const { itemCode, warehouse } = req.params;
      const bins = await BinService.getBinsByItemAndWarehouse(itemCode, warehouse, fields);
      res.json(bins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getLowStock(req, res) {
    try {
      const { threshold = 0, fields } = req.query;
      const bins = await BinService.getBinsWithLowStock(parseFloat(threshold), fields);
      res.json(bins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getZeroStock(req, res) {
    try {
      const { fields } = req.query;
      const bins = await BinService.getBinsWithZeroStock(fields);
      res.json(bins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByBatch(req, res) {
    try {
      const { fields } = req.query;
      const bins = await BinService.getBinsByBatch(req.params.batchNo, fields);
      res.json(bins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getBySerial(req, res) {
    try {
      const { fields } = req.query;
      const bins = await BinService.getBinsBySerial(req.params.serialNo, fields);
      res.json(bins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getExpiringBefore(req, res) {
    try {
      const { date, fields } = req.query;
      const bins = await BinService.getBinsExpiringBefore(date, fields);
      res.json(bins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getStockValueByWarehouse(req, res) {
    try {
      const { warehouse } = req.params;
      const stockValue = await BinService.getStockValueByWarehouse(warehouse);
      res.json(stockValue);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getStockSummaryByItem(req, res) {
    try {
      const { itemCode } = req.params;
      const stockSummary = await BinService.getStockSummaryByItem(itemCode);
      res.json(stockSummary);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new BinController();