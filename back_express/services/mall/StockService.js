const StockModel = require('../../models/StockModel');

class StockService {
  constructor() {
    this.stockModel = new StockModel();
  }

  async updateStock(productId, quantity) {
    try {
      return await this.stockModel.updateByProductId(productId, { quantity });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = StockService;
