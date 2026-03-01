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

  async validate(id) {
    return await this.updateById(id, { isValidated: true });
  }

  async suspend(id) {
    return await this.updateById(id, { isValidated: false });
  }
}

module.exports = BoutiqueModel;


