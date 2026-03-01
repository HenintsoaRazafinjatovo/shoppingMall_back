const PromotionModel = require('../../models/PromotionModel');

class PromotionService {
  constructor() {
    this.promotionModel = new PromotionModel();
  }

  async createPromotion(data) {
    try {
      return await this.promotionModel.create(data);
    } catch (error) {
      throw error;
    }
  }

  async getAllPromotions() {
    try {
      return await this.promotionModel.findAll();
    } catch (error) {
      throw error;
    }
  }

  async createGlobalPromotion(data) {
    try {
      // Ajoute ici la logique pour une promotion globale
      return await this.promotionModel.createGlobal(data);
    } catch (error) {
      throw error;
    }
  }

  async getActivePromotions() {
    try {
      return await this.promotionModel.findActive();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PromotionService;
