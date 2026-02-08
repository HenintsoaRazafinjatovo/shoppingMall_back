const BaseModel = require('./BaseModel');
const Stock = require('./Stock');

class StockModel extends BaseModel {
  constructor() {
    super(Stock);
  }

  async createStock(stockData) {
    const { productId, quantity, alertThreshold = 1 } = stockData;

    return await this.create({ productId, quantity, alertThreshold });
  }

  async updateStock(stockId, updates) {
    return await this.updateById(stockId, updates);
  }

  async deleteStock(stockId) {
    return await this.softDelete(stockId);
  }
  async findLowStock() {
    return await this.findAll({ quantity: { $lte: this.model.schema.path('alertThreshold').defaultValue } });
  }

}

module.exports = StockModel;
