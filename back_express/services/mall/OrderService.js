const OrderModel = require('../../models/OrderModel');

class OrderService {
  constructor() {
    this.orderModel = new OrderModel();
  }

  async createOrder(orderData) {
    try {
      return await this.orderModel.createOrder(orderData);
    } catch (error) {
      throw error;
    }
  }

  async getOrderById(orderId) {
    try {
      return await this.orderModel.getOrderById(orderId);
    } catch (error) {
      throw error;
    }
  }

  async getOrdersByUser(userId) {
    try {
      return await this.orderModel.getOrdersByUser(userId);
    } catch (error) {
      throw error;
    }
  }

  async getOrdersByBoutique(boutiqueId) {
    try {
      return await this.orderModel.getOrdersByBoutique(boutiqueId);
    } catch (error) {
      throw error;
    }
  }

  async getAllOrders() {
    try {
      return await this.orderModel.getAllOrders();
    } catch (error) {
      throw error;
    }
  }

  async updateItemStatus(orderId, productId, status) {
    try {
      return await this.orderModel.updateItemStatus(orderId, productId, status);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrderService;
