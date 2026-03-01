// This file was missing and is required for the mallRoutes to work.
// Renamed from 'productController.js' to 'ProductController.js' for proper import.

const ProductModel = require('../../models/ProductModel');

class ProductController {
  constructor() {
    this.productModel = new ProductModel();
  }

  async getAllProducts(req, res) {
    try {
      const products = await this.productModel.findAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const product = await this.productModel.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async searchProduct(req, res) {
    try {
      const { q } = req.query;
      const products = await this.productModel.search(q);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductsByBoutique(req, res) {
    try {
      const { boutiqueId } = req.params;
      const products = await this.productModel.findByBoutique(boutiqueId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductsByCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const products = await this.productModel.findByCategory(categoryId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProductController;
