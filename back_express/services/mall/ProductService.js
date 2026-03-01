const ProductModel = require('../../models/ProductModel');

class ProductService {
  constructor() {
    this.productModel = new ProductModel();
  }

  async createProduct(data) {
    try {
      return await this.productModel.create(data);
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts() {
    try {
      return await this.productModel.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      return await this.productModel.findById(productId);
    } catch (error) {
      throw error;
    }
  }

  async getProductsByBoutique(boutiqueId) {
    try {
      return await this.productModel.findAll({ boutiqueId });
    } catch (error) {
      throw error;
    }
  }

  async getProductsByCategory(categoryId) {
    try {
      return await this.productModel.findAll({ categoryId });
    } catch (error) {
      throw error;
    }
  }

  async searchProductByName(name) {
    try {
      return await this.productModel.findAll({ 
        name: { $regex: name, $options: 'i' } 
      });
    } catch (error) {
      throw error;
    }
  }

  async filterProducts(filters) {
    try {
      const query = {};
      
      // Filtre par catégorie
      if (filters.categoryId) {
        query.categoryId = filters.categoryId;
      }
      
      // Filtre par boutique
      if (filters.boutiqueId) {
        query.boutiqueId = filters.boutiqueId;
      }
      
      // Filtre par prix
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) {
          query.price.$gte = parseFloat(filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
          query.price.$lte = parseFloat(filters.maxPrice);
        }
      }
      
      // Recherche par nom
      if (filters.search) {
        query.name = { $regex: filters.search, $options: 'i' };
      }
      
      return await this.productModel.findAll(query);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;
