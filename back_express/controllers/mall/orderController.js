const OrderService = require('../../services/mall/OrderService');

class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = async (req, res) => {
    try {
      const order = await this.orderService.createOrder(req.body);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getAllOrders = async (req, res) => {
    try {
      const orders = await this.orderService.getAllOrders();

      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getOrderById = async (req, res) => {
    try {
      const order = await this.orderService.getOrderById(req.params.id);

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getOrdersByUser = async (req, res) => {
    try {
      const orders = await this.orderService.getOrdersByUser(req.params.userId);

      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getOrdersByBoutique = async (req, res) => {
    try {
      const orders = await this.orderService.getOrdersByBoutique(req.params.boutiqueId);

      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateItemStatus = async (req, res) => {
    try {
      const { orderId, productId, status } = req.body;

      const result = await this.orderService.updateItemStatus(orderId, productId, status);

      res.status(200).json({
        success: true,
        message: 'Item status updated',
        data: result
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}

module.exports = OrderController;
