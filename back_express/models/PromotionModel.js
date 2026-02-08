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
  async findActive() {
  return await this.model.aggregate([
    {
      $lookup: {
        from: "products",           // nom réel de la collection Mongo
        localField: "productIds",  // tableau dans Promotion
        foreignField: "_id",       // id dans Product
        as: "products"
      }
    }
  ]);
}

}

module.exports = PromotionModel;
