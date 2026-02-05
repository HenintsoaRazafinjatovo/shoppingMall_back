const BaseModel = require('./BaseModel');
const Promotion = require('./Promotion');

class PromotionModel extends BaseModel {
  constructor() {
    super(Promotion);
  }

  async createPromotion(promoData) {
    const { title, discountPercent, startDate, endDate, boutiqueId = null, productIds = [] } = promoData;

    return await this.create({ title, discountPercent, startDate, endDate, boutiqueId, productIds });
  }

  async updatePromotion(promoId, updates) {
    return await this.updateById(promoId, updates);
  }

  async deletePromotion(promoId) {
    return await this.softDelete(promoId);
  }
}

module.exports = PromotionModel;
