const BoutiqueService = require('../../services/mall/productService');


class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  createProduct = async (req, res) => {
    try {
      const product = await this.productService.createProduct(req.body);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getProductsByBoutique = async (req, res) => {
    try {
      const products = await this.productService.getProductsByBoutique(req.params.boutiqueId);

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getProductsByCategory = async (req, res) => {
    try {
      const products = await this.productService.getProductsByCategory(req.params.categoryId);

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  searchProduct = async (req, res) => {
    try {
      const { name } = req.query;
      const products = await this.productService.searchProductByName(name);

      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = ProductController;
