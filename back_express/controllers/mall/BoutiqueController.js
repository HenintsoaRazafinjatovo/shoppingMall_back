const BoutiqueService = require('../../services/mall/BoutiqueService');

class BoutiqueController {
  constructor() {
    this.boutiqueService = new BoutiqueService();
  }

  createBoutique = async (req, res) => {
    try {
      const boutique = await this.boutiqueService.createBoutique(req.body);

      res.status(201).json({
        success: true,
        message: 'Boutique created successfully',
        data: boutique
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAllBoutiques = async (req, res) => {
    try {
      const boutiques = await this.boutiqueService.getAllBoutiques();

      res.status(200).json({
        success: true,
        count: boutiques.length,
        data: boutiques
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getValidatedBoutiques = async (req, res) => {
    try {
      const boutiques = await this.boutiqueService.getAllValidatedBoutiques();

      res.status(200).json({
        success: true,
        count: boutiques.length,
        data: boutiques
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  validateBoutique = async (req, res) => {
    try {
      const result = await this.boutiqueService.validateBoutique(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Boutique validated',
        data: result
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  suspendBoutique = async (req, res) => {
    try {
      const result = await this.boutiqueService.suspendBoutique(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Boutique suspended',
        data: result
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  searchBoutique = async (req, res) => {
    try {
      const { name } = req.query;
      const boutiques = await this.boutiqueService.searchBoutiqueByName(name);

      res.status(200).json({
        success: true,
        count: boutiques.length,
        data: boutiques
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = BoutiqueController;
