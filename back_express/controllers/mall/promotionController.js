const PromotionService = require('../../services/mall/PromotionService');
const Promotion = require('../../models/Promotion');

class PromotionController {
  constructor() {
    this.promotionService = new PromotionService();
  }

  createPromotion = async (req, res) => {
    try {
      const promotion = await this.promotionService.createPromotion(req.body);
      res.status(201).json({ success: true, data: promotion });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  createGlobalPromotion = async (req, res) => {
    try {
      const promotionData = {
        ...req.body,
        boutiqueId: null // Promotion globale = pas de boutique
      };
      const promotion = await Promotion.create(promotionData);
      res.status(201).json({ success: true, data: promotion });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getAllPromotions = async (req, res) => {
    try {
      const promotions = await Promotion.find();
      res.status(200).json({ success: true, count: promotions.length, data: promotions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getActivePromotions = async (req, res) => {
    try {
      const promotions = await this.promotionService.getActivePromotions();
      res.status(200).json({ success: true, data: promotions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getGlobalPromotions = async (req, res) => {
    try {
      const promotions = await Promotion.find({ boutiqueId: null });
      res.status(200).json({ success: true, count: promotions.length, data: promotions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getPromotionsByBoutique = async (req, res) => {
    try {
      const { boutiqueId } = req.params;
      const promotions = await Promotion.find({ boutiqueId });
      res.status(200).json({ success: true, count: promotions.length, data: promotions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getPromotionById = async (req, res) => {
    try {
      const promotion = await Promotion.findById(req.params.id);
      if (!promotion) {
        return res.status(404).json({ success: false, message: 'Promotion not found' });
      }
      res.status(200).json({ success: true, data: promotion });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updatePromotion = async (req, res) => {
    try {
      const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!promotion) {
        return res.status(404).json({ success: false, message: 'Promotion not found' });
      }
      res.status(200).json({ success: true, data: promotion });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  deletePromotion = async (req, res) => {
    try {
      const promotion = await Promotion.findByIdAndDelete(req.params.id);
      if (!promotion) {
        return res.status(404).json({ success: false, message: 'Promotion not found' });
      }
      res.status(200).json({ success: true, message: 'Promotion deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = PromotionController;
