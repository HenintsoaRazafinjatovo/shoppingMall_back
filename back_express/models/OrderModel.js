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

  async getOrderById(orderId) {
    return await this.model.findById(orderId)
      .populate('userId', 'fullName email')
      .populate('items.productId', 'name price images')
      .populate('items.boutiqueId', 'name')
      .exec();
  }

  async getOrdersByUser(userId) {
    return await this.model.find({ userId })
      .populate('items.productId', 'name price images')
      .populate('items.boutiqueId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getOrdersByBoutique(boutiqueId) {
    return await this.model.find({ 'items.boutiqueId': boutiqueId })
      .populate('userId', 'fullName email phone')
      .populate('items.productId', 'name price images')
      .populate('items.boutiqueId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getAllOrders() {
    return await this.model.find({})
      .populate('userId', 'fullName email')
      .populate('items.productId', 'name price images')
      .populate('items.boutiqueId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async updateItemStatus(orderId, productId, status) {
    return await this.model.findOneAndUpdate(
      { _id: orderId, 'items.productId': productId },
      { $set: { 'items.$.status': status } },
      { new: true }
    ).exec();
  }

  async updateOrder(orderId, updates) {
    return await this.updateById(orderId, updates);
  }

  async deleteOrder(orderId) {
    return await this.softDelete(orderId);
  }
}

module.exports = OrderModel;
