const CategoryModel = require('../../models/CategoryModel');

class CategoryService {
  constructor() {
    this.categoryModel = new CategoryModel();
  }

  async createCategory(data) {
    return await this.categoryModel.createCategory(data);
  }

  async getAllCategories() {
    return await this.categoryModel.getAllCategories();
  }
}

module.exports = CategoryService;
