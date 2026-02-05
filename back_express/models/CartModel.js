const BaseModel = require('./BaseModel');
const CartSchema = require('./Cart');

class CartModel extends BaseModel {
  constructor() {
    super(CartSchema);
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

module.exports = CartModel;
