const CartModel = require('../../models/CartModel');

class CartService {
  constructor() {
    this.cartModel = new CartModel();
  }

  async getCartByUser(userId) {
    try {
      return await this.cartModel.findByUserId(userId);
    } catch (error) {
      throw new Error(`Error fetching cart: ${error.message}`);
    }
  }

  async addItemToCart(userId, item) {
    try {
      return await this.cartModel.addItem(userId, item);
    } catch (error) {
      throw new Error(`Error adding item to cart: ${error.message}`);
    }
  }

  async clearCart(userId) {
    try {
      return await this.cartModel.clear(userId);
    } catch (error) {
      throw new Error(`Error clearing cart: ${error.message}`);
    }
  }
  async addItemToCart(userId, item) {
  try {
    return await this.cartModel.addItem(userId, item);
  } catch (error) {
    throw new Error(`Error adding item to cart: ${error.message}`);
  }
}

async getCartByUser(userId) {
  try {
    return await this.cartModel.findByUserId(userId);
  } catch (error) {
    throw new Error(`Error fetching cart: ${error.message}`);
  }
}

async clearCart(userId) {
  try {
    return await this.cartModel.clear(userId);
  } catch (error) {
    throw new Error(`Error clearing cart: ${error.message}`);
  }
}

}

module.exports = CartService;
