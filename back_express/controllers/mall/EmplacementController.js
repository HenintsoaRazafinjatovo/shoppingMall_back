const Emplacement = require('../../models/Emplacement');

class EmplacementController {
  getAllEmplacements = async (req, res) => {
    try {
      const emplacements = await Emplacement.find().populate('boutiqueId', 'name');
      res.status(200).json({ success: true, count: emplacements.length, data: emplacements });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getAvailableEmplacements = async (req, res) => {
    try {
      const emplacements = await Emplacement.find({ isAvailable: true });
      res.status(200).json({ success: true, count: emplacements.length, data: emplacements });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getEmplacementById = async (req, res) => {
    try {
      const emplacement = await Emplacement.findById(req.params.id).populate('boutiqueId', 'name');
      if (!emplacement) {
        return res.status(404).json({ success: false, message: 'Emplacement non trouvé' });
      }
      res.status(200).json({ success: true, data: emplacement });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  createEmplacement = async (req, res) => {
    try {
      const emplacement = await Emplacement.create(req.body);
      res.status(201).json({ success: true, data: emplacement });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ success: false, message: 'Ce code d\'emplacement existe déjà' });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateEmplacement = async (req, res) => {
    try {
      const emplacement = await Emplacement.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!emplacement) {
        return res.status(404).json({ success: false, message: 'Emplacement non trouvé' });
      }
      res.status(200).json({ success: true, data: emplacement });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  deleteEmplacement = async (req, res) => {
    try {
      const emplacement = await Emplacement.findByIdAndDelete(req.params.id);
      if (!emplacement) {
        return res.status(404).json({ success: false, message: 'Emplacement non trouvé' });
      }
      res.status(200).json({ success: true, message: 'Emplacement supprimé' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  assignBoutique = async (req, res) => {
    try {
      const { boutiqueId } = req.body;
      const emplacement = await Emplacement.findByIdAndUpdate(
        req.params.id,
        { boutiqueId, isAvailable: boutiqueId ? false : true },
        { new: true }
      ).populate('boutiqueId', 'name');
      if (!emplacement) {
        return res.status(404).json({ success: false, message: 'Emplacement non trouvé' });
      }
      res.status(200).json({ success: true, data: emplacement });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = EmplacementController;
