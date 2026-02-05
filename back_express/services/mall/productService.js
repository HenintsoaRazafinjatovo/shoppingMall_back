const Product = require('../../models/Product');

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

async getProductsByCategory(categoryId) {
  try {
    return await this.productModel.findAll({ categoryId });
  } catch (error) {
    throw new Error(`Error fetching products by category: ${error.message}`);
  }
}

async getProductsByBoutique(boutiqueId) {
  try {
    return await this.productModel.findAll({ boutiqueId });
  } catch (error) {
    throw new Error(`Error fetching products by boutique: ${error.message}`);
  }
}

}

module.exports = ProductService;
