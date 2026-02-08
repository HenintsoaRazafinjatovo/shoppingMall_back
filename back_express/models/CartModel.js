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
  async getCartByUser(userId) {
    return await this.findOne({ userId });
  }
  async addItem(userId, item) {
  let cart = await this.findOne({ userId });

  if (!cart) {
    cart = await this.create({ userId, items: [item] });
  } else {
    cart.items.push(item);
    await cart.save();
  }

  return cart;
}

async clear(userId) {
  const cart = await this.findOne({ userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  return cart;
}
}


module.exports = CartModel;
