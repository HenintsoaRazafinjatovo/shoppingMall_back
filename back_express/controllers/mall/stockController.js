const StockService = require('../../services/mall/StockService');
const Stock = require('../../models/Stock');
const Product = require('../../models/Product');
const StockTransaction = require('../../models/StockTransaction');

class StockController {
  constructor() {
    this.stockService = new StockService();
  }

  // Get all stocks for a boutique (via products)
  getStocksByBoutique = async (req, res) => {
    try {
      const { boutiqueId } = req.params;
      
      // Get all products for this boutique
      const products = await Product.find({ boutiqueId });
      const productIds = products.map(p => p._id);
      
      // Get stocks for these products
      const stocks = await Stock.find({ productId: { $in: productIds } })
        .populate('productId', 'name price images');
      
      // Create a map for quick lookup
      const stockMap = new Map();
      stocks.forEach(s => stockMap.set(s.productId._id.toString(), s));
      
      // Build result with all products and their stock info
      const result = products.map(product => {
        const stock = stockMap.get(product._id.toString());
        return {
          _id: stock?._id || null,
          product: {
            _id: product._id,
            name: product.name,
            price: product.price,
            images: product.images
          },
          quantity: stock?.quantity || 0,
          alertThreshold: stock?.alertThreshold || 5,
          updatedAt: stock?.updatedAt || null
        };
      });
      
      res.status(200).json({ success: true, count: result.length, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  // Get stock for a specific product
  getStockByProduct = async (req, res) => {
    try {
      const { productId } = req.params;
      let stock = await Stock.findOne({ productId }).populate('productId', 'name price');
      
      if (!stock) {
        // Return default stock info
        stock = { productId, quantity: 0, alertThreshold: 5 };
      }
      
      res.status(200).json({ success: true, data: stock });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateStock = async (req, res) => {
    try {
      const { productId, quantity, alertThreshold, type, reason } = req.body;
      
      // Get product to find boutiqueId
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Produit non trouvé' });
      }
      
      let stock = await Stock.findOne({ productId });
      const previousStock = stock?.quantity || 0;
      
      if (stock) {
        stock.quantity = quantity;
        if (alertThreshold !== undefined) stock.alertThreshold = alertThreshold;
        await stock.save();
      } else {
        stock = await Stock.create({ 
          productId, 
          quantity, 
          alertThreshold: alertThreshold || 5 
        });
      }
      
      // Record the transaction
      const transactionType = type || (quantity > previousStock ? 'ENTREE' : quantity < previousStock ? 'SORTIE' : 'AJUSTEMENT');
      
      await StockTransaction.create({
        productId,
        boutiqueId: product.boutiqueId,
        type: transactionType,
        quantity: Math.abs(quantity - previousStock),
        previousStock,
        newStock: quantity,
        reason: reason || ''
      });
      
      res.status(200).json({ success: true, data: stock });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getStockTransactions = async (req, res) => {
    try {
      const { boutiqueId } = req.params;
      const { limit = 50 } = req.query;
      
      const transactions = await StockTransaction.find({ boutiqueId })
        .populate('productId', 'name images')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));
      
      res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getProductTransactions = async (req, res) => {
    try {
      const { productId } = req.params;
      const { limit = 20 } = req.query;
      
      const transactions = await StockTransaction.find({ productId })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));
      
      res.status(200).json({ success: true, count: transactions.length, data: transactions });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getLowStockProducts = async (req, res) => {
    try {
      const { boutiqueId } = req.query;
      
      let query = {};
      if (boutiqueId) {
        const products = await Product.find({ boutiqueId });
        const productIds = products.map(p => p._id);
        query = { productId: { $in: productIds } };
      }
      
      const stocks = await Stock.find(query).populate('productId', 'name price images boutiqueId');
      
      // Filter low stock items
      const lowStock = stocks.filter(s => s.quantity <= s.alertThreshold);
      
      res.status(200).json({ success: true, count: lowStock.length, data: lowStock });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}

module.exports = StockController;
