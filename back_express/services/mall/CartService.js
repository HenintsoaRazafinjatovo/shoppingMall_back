const CartModel = require('../../models/CartModel');

class CartService {
  constructor() {
    this.cartModel = new CartModel();
  }

  async getCartByUser(userId) {
    try {
      return await this.cartModel.getCartByUser(userId);
    } catch (error) {
      throw error;
    }
  }


  async addItemToCart(userId, item) {
    // item: { productId, quantity }
    try {
      return await this.cartModel.addToCart(userId, item.productId, item.quantity);
    } catch (error) {
      throw error;
    }
  }

  async clearCart(userId) {
    try {
      return await this.cartModel.clearCart(userId);
    } catch (error) {
      throw error;
    }
  }

  async removeFromCart(userId, productId) {
    try {
      return await this.cartModel.removeFromCart(userId, productId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CartService;
