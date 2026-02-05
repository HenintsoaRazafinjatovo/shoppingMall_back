const Category = require('../../models/Category');

class CategoryService {
  constructor() {
    this.categoryModel = new Category();
  }

  async createCategory(data) {
    try {
      return await this.categoryModel.create(data);
    } catch (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }
  }

  async getAllCategories() {
    try {
      return await this.categoryModel.findAll();
    } catch (error) {
      throw new Error(`Error fetching categories: ${error.message}`);
    }
  }
}

module.exports = CategoryService;
