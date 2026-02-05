const PromotionService = require('../../services/mall/promotionService');

class PromotionController {
  constructor() {
    this.promotionService = new PromotionService();
  }

  createPromotion = async (req, res) => {
    try {
      const promotion = await this.promotionService.createPromotion(req.body);
      res.status(201).json(promotion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  createGlobalPromotion = async (req, res) => {
    try {
      const promotion = await this.promotionService.createGlobalPromotion(req.body);
      res.status(201).json(promotion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getActivePromotions = async (req, res) => {
    try {
      const promotions = await this.promotionService.getActivePromotions();
      res.status(200).json(promotions);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

module.exports = PromotionController;
