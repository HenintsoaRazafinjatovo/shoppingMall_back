const BaseModel = require('./BaseModel');
const BoutiqueSchema = require('./Boutique');

class BoutiqueModel extends BaseModel {
  constructor() {
    super(BoutiqueSchema);
  }

  async findValidated() {
    return await this.findAll({ isValidated: true });
  }

  async searchByName(name) {
    return await this.findAll({ name: new RegExp(name, 'i') });
  }
}

module.exports = BoutiqueModel;


