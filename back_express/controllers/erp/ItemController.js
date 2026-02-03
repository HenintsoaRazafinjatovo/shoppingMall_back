const ItemService = require('../../services/erp/ItemService');

class ItemController {
//   async getAll(req, res) {
//     try {
//       const items = await ItemService.getAllItems();
//       res.json(items);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }

    async getAll(req, res) {
    try {
        const { fields } = req.query;
        const items = await ItemService.getAllItems(fields);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    }
//   async getOne(req, res) {
//     try {
//       const item = await ItemService.getItemByName(req.params.name);
//       res.json(item);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }

    async getOne(req, res) {
    try {
        const { fields } = req.query; // Récupère les champs depuis les query params
        const item = await ItemService.getItemByName(req.params.name, fields);
        
        if (!item) {
        return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const items = await ItemService.searchItems(filters, fields);
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const items = await ItemService.searchItemsBetweenDates(fromDate, toDate, extraFilters, fields);
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const item = await ItemService.createItem(req.body);
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const item = await ItemService.updateItem(req.params.name, req.body);
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await ItemService.deleteItem(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new ItemController();
