const BaseModel = require('./BaseModel');
const CategorySchema = require('./Category');

class CategoryModel extends BaseModel {
  constructor() {
    super(CategorySchema);
  }

  async createCategory(data) {
    const existing = await this.findOne({ name: data.name });
    if (existing) throw new Error('Category already exists');
    return await this.create(data);
  }

  async getAllCategories() {
    return await this.findAll();
  }
}

module.exports = CategoryModel; // ⚠️ PAS new

