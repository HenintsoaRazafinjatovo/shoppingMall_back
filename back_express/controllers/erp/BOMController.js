const BOMService = require('../../services/erp/BOMService');

class BOMController {
  async getAll(req, res) {
    try {
      const { fields } = req.query;
      const boms = await BOMService.getAllBOMs(fields);
      res.json(boms);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const { fields } = req.query;
      const bom = await BOMService.getBOMByName(req.params.name, fields);
      
      if (!bom) {
        return res.status(404).json({ error: 'BOM not found' });
      }
      res.json(bom);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByItem(req, res) {
    try {
      const { fields } = req.query;
      const { item } = req.params;
      const boms = await BOMService.getBOMByItem(item, fields);
      res.json(boms);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getDefaultByItem(req, res) {
    try {
      const { fields } = req.query;
      const { item } = req.params;
      const bom = await BOMService.getDefaultBOM(item, fields);
      
      if (!bom) {
        return res.status(404).json({ error: 'Default BOM not found for this item' });
      }
      res.json(bom);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getBOMItems(req, res) {
    try {
      const { fields } = req.query;
      const { name } = req.params;
      const items = await BOMService.getBOMItems(name, fields);
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getBOMOperations(req, res) {
    try {
      const { fields } = req.query;
      const { name } = req.params;
      const operations = await BOMService.getBOMOperations(name, fields);
      res.json(operations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const boms = await BOMService.searchBOMs(filters, fields);
      res.json(boms);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const boms = await BOMService.searchBOMsBetweenDates(fromDate, toDate, extraFilters, fields);
      res.json(boms);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const bom = await BOMService.createBOM(req.body);
      res.json(bom);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const bom = await BOMService.updateWithCancelAndSubmitBOM(req.params.name, req.body);
      res.json(bom);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await BOMService.deleteWithCancelBOM(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new BOMController();