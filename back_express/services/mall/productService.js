const Product = require('../../models/ProductModel');

class ProductService {
  constructor() {
    this.productModel = new Product();
  }

  async createProduct(data) {
    try {
      return await this.productModel.create(data);
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  async getProductsByBoutique(boutiqueId) {
    try {
      return await this.productModel.findAll({ boutiqueId, isActive: true });
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  async getProductsByCategory(categoryId) {
    try {
      return await this.productModel.findAll({ categoryId, isActive: true });
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }
  async searchProductByName(name) {
    try {
      return await this.productModel.findAll({ name: new RegExp(name, 'i') });
    } catch (error) {
      throw new Error(`Error searching product: ${error.message}`);
    }
  }

  async getAllProducts() {
    try {
      return await this.productModel.findAll();
    } catch (error) {
      throw new Error(`Error fetching all products: ${error.message}`);
    }
  }
}

module.exports = ProductService;
