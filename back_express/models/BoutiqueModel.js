const BaseModel = require('./BaseModel');
const Boutique = require('./Boutique');

class BoutiqueModel extends BaseModel {
  constructor() {
    super(Boutique);
  }

  // Création d'une boutique
  async createBoutique(boutiqueData) {
    const { name, description = '', logo = '', ownerId, isValidated = false } = boutiqueData;

    const existing = await this.findOne({ name });
    if (existing) throw new Error('Boutique already exists');

    return await this.create({
      name,
      description,
      logo,
      ownerId,
      isValidated
    });
  }

  // Mise à jour d'une boutique
  async updateBoutique(boutiqueId, updates) {
    return await this.updateById(boutiqueId, updates);
  }

  // Suppression soft
  async deleteBoutique(boutiqueId) {
    return await this.softDelete(boutiqueId);
  }
}

module.exports = new BoutiqueModel();
