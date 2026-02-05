const Boutique = require('../../models/Boutique');

class BoutiqueService {
  constructor() {
    this.boutiqueModel = new Boutique();
  }

  async createBoutique(data) {
    try {
      return await this.boutiqueModel.create(data);
    } catch (error) {
      throw new Error(`Error creating boutique: ${error.message}`);
    }
  }

  async getAllValidatedBoutiques() {
    try {
      return await this.boutiqueModel.findAll({ isValidated: true });
    } catch (error) {
      throw new Error(`Error fetching boutiques: ${error.message}`);
    }
  }
  async getAllBoutiques() {
  try {
    return await this.boutiqueModel.findAll();
  } catch (error) {
    throw new Error(`Error fetching boutiques: ${error.message}`);
  }
}

async validateBoutique(boutiqueId) {
  try {
    return await this.boutiqueModel.updateById(boutiqueId, { isValidated: true });
  } catch (error) {
    throw new Error(`Error validating boutique: ${error.message}`);
  }
}

async suspendBoutique(boutiqueId) {
  try {
    return await this.boutiqueModel.updateById(boutiqueId, { isValidated: false });
  } catch (error) {
    throw new Error(`Error suspending boutique: ${error.message}`);
  }
}

async searchBoutiqueByName(name) {
  try {
    return await this.boutiqueModel.findAll({ name: new RegExp(name, 'i') });
  } catch (error) {
    throw new Error(`Error searching boutique: ${error.message}`);
  }
}

}

module.exports = BoutiqueService;
