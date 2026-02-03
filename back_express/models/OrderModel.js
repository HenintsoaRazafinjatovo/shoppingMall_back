const BaseModel = require('./BaseModel');
const Order = require('./Order');

class OrderModel extends BaseModel {
  constructor() {
    super(Order);
  }

  async createOrder(orderData) {
    const { userId, items = [], totalAmount, paymentStatus = 'PENDING', deliveryType } = orderData;

    return await this.create({ userId, items, totalAmount, paymentStatus, deliveryType });
  }

  async updateOrder(orderId, updates) {
    return await this.updateById(orderId, updates);
  }

  async deleteOrder(orderId) {
    return await this.softDelete(orderId);
  }
}

module.exports = new OrderModel();
