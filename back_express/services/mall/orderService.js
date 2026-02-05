const Order = require('../../models/Order');

class OrderService {
  constructor() {
    this.orderModel = new Order();
  }

  async createOrder(orderData) {
    try {
      return await this.orderModel.createOrder(orderData);
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  async getOrdersByUser(userId) {
    try {
      return await this.orderModel.findAll({ userId });
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  }

  async updateOrderStatus(orderId, updates) {
    try {
      return await this.orderModel.updateOrder(orderId, updates);
    } catch (error) {
      throw new Error(`Error updating order: ${error.message}`);
    }
  }
  async getOrdersByBoutique(boutiqueId) {
  try {
    return await this.orderModel.findByBoutiqueId(boutiqueId);
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
}

async updateItemStatus(orderId, productId, status) {
  try {
    return await this.orderModel.updateItemStatus(orderId, productId, status);
  } catch (error) {
    throw new Error(`Error updating item status: ${error.message}`);
  }
}

async getTopBoutiques() {
  try {
    return await this.orderModel.aggregateTopBoutiques();
  } catch (error) {
    throw new Error(`Error fetching top boutiques: ${error.message}`);
  }
}

async getTopCategories() {
  try {
    return await this.orderModel.aggregateTopCategories();
  } catch (error) {
    throw new Error(`Error fetching top categories: ${error.message}`);
  }
}

async getTopProductsByBoutique(boutiqueId) {
  try {
    return await this.orderModel.aggregateTopProducts(boutiqueId);
  } catch (error) {
    throw new Error(`Error fetching top products: ${error.message}`);
  }
}

}

module.exports = OrderService;
