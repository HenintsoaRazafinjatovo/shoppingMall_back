const StockService = require('../../services/mall/stockService');

class StockController {
  constructor() {
    this.stockService = new StockService();
  }

  updateStock = async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const stock = await this.stockService.updateStock(productId, quantity);
      res.status(200).json(stock);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getLowStockProducts = async (req, res) => {
    try {
      const products = await this.stockService.getLowStockProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

module.exports = StockController;
