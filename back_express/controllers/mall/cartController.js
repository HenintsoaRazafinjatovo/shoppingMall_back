const CartService = require('../../services/mall/CartService');

class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  getCartByUser = async (req, res) => {
    try {
      const cart = await this.cartService.getCartByUser(req.params.userId);

      res.status(200).json({
        success: true,
        data: cart
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  addItemToCart = async (req, res) => {
    try {
      const result = await this.cartService.addItemToCart(req.params.userId, req.body);

      res.status(200).json({
        success: true,
        message: 'Item added to cart',
        data: result
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  clearCart = async (req, res) => {
    try {
      const result = await this.cartService.clearCart(req.params.userId);

      res.status(200).json({
        success: true,
        message: 'Cart cleared',
        data: result
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}

module.exports = CartController;
