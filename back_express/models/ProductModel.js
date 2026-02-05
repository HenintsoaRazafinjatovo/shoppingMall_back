const BaseModel = require('./BaseModel');
const Product = require('./Product');

class ProductModel extends BaseModel {
  constructor() {
    super(Product);
  }

  // Création d'un produit
  async createProduct(productData) {
    const { name, description = '', price, images = [], categoryId, boutiqueId, isActive = true } = productData;

    return await this.create({
      name,
      description,
      price,
      images,
      categoryId,
      boutiqueId,
      isActive
    });
  }

  // Mise à jour d'un produit
  async updateProduct(productId, updates) {
    return await this.updateById(productId, updates);
  }

  // Suppression soft
  async deleteProduct(productId) {
    return await this.softDelete(productId);
  }
}

module.exports =  ProductModel;
