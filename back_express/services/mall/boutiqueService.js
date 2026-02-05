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

  async getAllValidatedBoutiques() {
    return await this.boutiqueModel.findValidated();
  }

  async validateBoutique(id) {
    return await this.boutiqueModel.updateById(id, { isValidated: true });
  }

  async suspendBoutique(id) {
    return await this.boutiqueModel.updateById(id, { isValidated: false });
  }

  async searchBoutiqueByName(name) {
    return await this.boutiqueModel.searchByName(name);
  }
}

module.exports = BoutiqueService;
