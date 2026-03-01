const ProductService = require('../../services/mall/ProductService');


class ProductController {
  constructor() {
    this.productService = new ProductService();
  }
  getAllProducts = async (req, res) => {
    try {
      const products = await this.productService.getAllProducts();
      res.status(200).json({
        success: true,
        count: products.length,
        data: products
      });
    } catch (error) { 
      res.status(500).json({ success: false, message: error.message });
    }
  };

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

  getProductById = async (req, res) => {
    try {
      const product = await this.productService.getProductById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  filterProducts = async (req, res) => {
    try {
      const { categoryId, boutiqueId, minPrice, maxPrice, search, sort } = req.query;
      
      let products = await this.productService.filterProducts({
        categoryId,
        boutiqueId,
        minPrice,
        maxPrice,
        search
      });
      
      // Tri
      if (sort === 'price-low') {
        products = products.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        products = products.sort((a, b) => b.price - a.price);
      } else if (sort === 'newest') {
        products = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

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
