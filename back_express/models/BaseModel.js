class BaseModel {
  constructor(model) {
    this.model = model; // modèle Mongoose
  }

  async create(doc) {
    return await this.model.create(doc);
  }

  async findById(id) {
    return await this.model.findById(id).exec();
  }

  async findAll(conditions = {}) {
    return await this.model.find(conditions).exec();
  }

  async findOne(conditions = {}) {
    return await this.model.findOne(conditions).exec();
  }

  async updateById(id, updates) {
    return await this.model.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true } // retourne le document mis à jour
    ).exec();
  }

  async softDelete(id) {
    return await this.model.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    ).exec();
  }
}

module.exports = BaseModel;
