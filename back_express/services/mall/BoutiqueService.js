// This file was missing and is required for the controller to work.
// Renamed from 'boutiqueService.js' to 'BoutiqueService.js' for proper import.

const BoutiqueModel = require('../../models/BoutiqueModel');

class BoutiqueService {
  constructor() {
    this.boutiqueModel = new BoutiqueModel();
  }

  async createBoutique(data) {
    return await this.boutiqueModel.create(data);
  }

  async getAllBoutiques() {
    return await this.boutiqueModel.findAll();
  }

  async getBoutiqueById(id) {
    return await this.boutiqueModel.findById(id);
  }

  async getAllValidatedBoutiques() {
    return await this.boutiqueModel.findValidated();
  }

  async validateBoutique(id) {
    return await this.boutiqueModel.validate(id);
  }

  async suspendBoutique(id) {
    return await this.boutiqueModel.suspend(id);
  }

  async searchBoutiqueByName(name) {
    return await this.boutiqueModel.searchByName(name);
  }

  async updateBoutique(id, data) {
    return await this.boutiqueModel.updateById(id, data);
  }

  async deleteBoutique(id) {
    return await this.boutiqueModel.softDelete(id);
  }
}

module.exports = BoutiqueService;
