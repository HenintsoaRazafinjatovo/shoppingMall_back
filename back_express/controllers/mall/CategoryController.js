// This file was missing and is required for the mallRoutes to work.
// Renamed from 'categoryController.js' to 'CategoryController.js' for proper import.

const CategoryModel = require('../../models/CategoryModel');

class CategoryController {
  constructor() {
    this.categoryModel = new CategoryModel();
  }

  // Example method
  async getAllCategories(req, res) {
    try {
      const categories = await this.categoryModel.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CategoryController;
