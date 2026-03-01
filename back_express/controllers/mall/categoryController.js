const CategoryService = require('../../services/mall/CategoryService');

class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  createCategory = async (req, res) => {
    try {
      const category = await this.categoryService.createCategory(req.body);

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAllCategories = async (req, res) => {
    try {
      const categories = await this.categoryService.getAllCategories();

      res.status(200).json({
        success: true,
        count: categories.length,
        data: categories
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = CategoryController;
