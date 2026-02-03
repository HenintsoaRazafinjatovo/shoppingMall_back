const BaseModel = require('./BaseModel');
const Category = require('./Category');

class CategoryModel extends BaseModel {
  constructor() {
    super(Category);
  }

  // Création d'une catégorie avec vérification unique
  async createCategory(categoryData) {
    const { name } = categoryData;

    const existing = await this.findOne({ name });
    if (existing) throw new Error('Category already exists');

    return await this.create({ name });
  }

  // Mise à jour d'une catégorie
  async updateCategory(categoryId, updates) {
    return await this.updateById(categoryId, updates);
  }

  // Suppression soft
  async deleteCategory(categoryId) {
    return await this.softDelete(categoryId);
  }
}

module.exports = new CategoryModel();
