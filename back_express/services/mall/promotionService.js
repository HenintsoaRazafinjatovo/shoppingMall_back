const Promotion = require('../../models/Promotion');

class PromotionService {
  constructor() {
    this.promotionModel = new Promotion();
  }

  async createPromotion(data) {
    try {
      return await this.promotionModel.create(data);
    } catch (error) {
      throw new Error(`Error creating promotion: ${error.message}`);
    }
  }

  async getActivePromotions() {
    try {
      return await this.promotionModel.findActive();
    } catch (error) {
      throw new Error(`Error fetching promotions: ${error.message}`);
    }
  }
  async createGlobalPromotion(data) {
  try {
    return await this.promotionModel.create(data);
  } catch (error) {
    throw new Error(`Error creating promotion: ${error.message}`);
  }
}

async getActivePromotions() {
  try {
    return await this.promotionModel.findActive();
  } catch (error) {
    throw new Error(`Error fetching promotions: ${error.message}`);
  }
}

}

module.exports = PromotionService;
