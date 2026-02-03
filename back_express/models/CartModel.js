const BaseModel = require('./BaseModel');
const Cart = require('./Cart');

class CartModel extends BaseModel {
  constructor() {
    super(Cart);
  }

  async createCart(cartData) {
    const { userId, items = [] } = cartData;

    return await this.create({ userId, items });
  }

  async updateCart(cartId, updates) {
    return await this.updateById(cartId, updates);
  }

  async deleteCart(cartId) {
    return await this.softDelete(cartId);
  }
}

module.exports = new CartModel();
