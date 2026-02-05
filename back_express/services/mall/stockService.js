const Stock = require('../../models/Stock');

class StockService {
  constructor() {
    this.stockModel = new Stock();
  }

  async updateStock(productId, quantity) {
    try {
      return await this.stockModel.updateByProductId(productId, { quantity });
    } catch (error) {
      throw new Error(`Error updating stock: ${error.message}`);
    }
  }

  async getLowStockProducts() {
    try {
      return await this.stockModel.findLowStock();
    } catch (error) {
      throw new Error(`Error fetching low stock: ${error.message}`);
    }
  }
  async updateStock(productId, quantity) {
  try {
    return await this.stockModel.updateByProductId(productId, {
      quantity,
      updatedAt: new Date()
    });
  } catch (error) {
    throw new Error(`Error updating stock: ${error.message}`);
  }
}

}

module.exports = StockService;
