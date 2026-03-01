const express = require('express');
const router = express.Router();


// Controllers
const UserController = require('../../controllers/mall/UserController');
const BoutiqueController = require('../../controllers/mall/BoutiqueController');
const ProductController = require('../../controllers/mall/productController');
const CategoryController = require('../../controllers/mall/categoryController');
const CartController = require('../../controllers/mall/cartController');
const OrderController = require('../../controllers/mall/orderController');
const PromotionController = require('../../controllers/mall/promotionController');
const ReviewController = require('../../controllers/mall/reviewController');
const StockController = require('../../controllers/mall/stockController');
const StatsController = require('../../controllers/mall/statsController');
const EmplacementController = require('../../controllers/mall/EmplacementController');


// Instances
const userCtrl = new UserController();
const boutiqueCtrl = new BoutiqueController();
const productCtrl = new ProductController();
const categoryCtrl = new CategoryController();
const cartCtrl = new CartController();
const orderCtrl = new OrderController();
const promotionCtrl = new PromotionController();
const reviewCtrl = new ReviewController();
const stockCtrl = new StockController();
const statsCtrl = new StatsController();
const emplacementCtrl = new EmplacementController();

///////////////////////////
// USERS
///////////////////////////

router.get('/users', userCtrl.getAllUsers);
router.get('/users/search', userCtrl.searchUsers);
router.get('/users/:id', userCtrl.getUserById);
router.post('/users', userCtrl.createUser);
router.put('/users/:id', userCtrl.updateUser);
router.delete('/users/:id', userCtrl.deleteUser);
// router.get('/users/id/:id', userCtrl.getUserById);
// router.get('/users/email', userCtrl.getUserByEmail);
// router.put('/users/:id', userCtrl.updateUserProfile);
// router.delete('/users/:id', userCtrl.deleteUser);
// router.post('/users/verify-password', userCtrl.verifyPassword);

///////////////////////////
// BOUTIQUES
///////////////////////////

router.post('/boutiques', boutiqueCtrl.createBoutique);
router.get('/boutiques', boutiqueCtrl.getAllBoutiques);
router.get('/boutiques/validated', boutiqueCtrl.getValidatedBoutiques);
router.get('/boutiques/search', boutiqueCtrl.searchBoutique);
router.get('/boutiques/:id', boutiqueCtrl.getBoutiqueById);
router.put('/boutiques/:id', boutiqueCtrl.updateBoutique);
router.put('/boutiques/:id/validate', boutiqueCtrl.validateBoutique);
router.put('/boutiques/:id/suspend', boutiqueCtrl.suspendBoutique);
router.delete('/boutiques/:id', boutiqueCtrl.deleteBoutique);

///////////////////////////
// PRODUCTS
///////////////////////////

router.get('/products', productCtrl.getAllProducts);
router.post('/products', productCtrl.createProduct);
router.get('/products/search', productCtrl.searchProduct);
router.get('/products/filter', productCtrl.filterProducts);
router.get('/products/boutique/:boutiqueId', productCtrl.getProductsByBoutique);
router.get('/products/category/:categoryId', productCtrl.getProductsByCategory);
router.get('/products/:id', productCtrl.getProductById);

///////////////////////////
// CATEGORIES
///////////////////////////

router.post('/categories', categoryCtrl.createCategory);
router.get('/categories', categoryCtrl.getAllCategories);

//////////////////////////
// CART
///////////////////////////

router.get('/cart/:userId', cartCtrl.getCartByUser);
router.post('/cart/:userId', cartCtrl.addItemToCart);
router.delete('/cart/:userId', cartCtrl.clearCart);

///////////////////////////
// ORDERS
///////////////////////////

router.post('/orders', orderCtrl.createOrder);
router.get('/orders', orderCtrl.getAllOrders);
router.get('/orders/user/:userId', orderCtrl.getOrdersByUser);
router.get('/orders/boutique/:boutiqueId', orderCtrl.getOrdersByBoutique);
router.get('/orders/:id', orderCtrl.getOrderById);
router.put('/orders/item-status', orderCtrl.updateItemStatus);

///////////////////////////
// PROMOTIONS
///////////////////////////

router.post('/promotions', promotionCtrl.createPromotion);
router.post('/promotions/global', promotionCtrl.createGlobalPromotion);
router.get('/promotions', promotionCtrl.getAllPromotions);
router.get('/promotions/active', promotionCtrl.getActivePromotions);
router.get('/promotions/global', promotionCtrl.getGlobalPromotions);
router.get('/promotions/boutique/:boutiqueId', promotionCtrl.getPromotionsByBoutique);
router.get('/promotions/:id', promotionCtrl.getPromotionById);
router.put('/promotions/:id', promotionCtrl.updatePromotion);
router.delete('/promotions/:id', promotionCtrl.deletePromotion);

///////////////////////////
// REVIEWS
///////////////////////////

router.post('/reviews', reviewCtrl.addReview);
router.get('/reviews/product/:productId', reviewCtrl.getReviewsByProduct);

///////////////////////////
// STOCK
///////////////////////////

router.get('/stocks/boutique/:boutiqueId', stockCtrl.getStocksByBoutique);
router.get('/stocks/product/:productId', stockCtrl.getStockByProduct);
router.get('/stocks/low', stockCtrl.getLowStockProducts);
router.get('/stocks/transactions/boutique/:boutiqueId', stockCtrl.getStockTransactions);
router.get('/stocks/transactions/product/:productId', stockCtrl.getProductTransactions);
router.put('/stocks', stockCtrl.updateStock);

///////////////////////////
// STATS (Dashboard)
///////////////////////////

router.get('/stats/top-products/:boutiqueId', statsCtrl.getTopProducts);
router.get('/stats/sales-by-day/:boutiqueId', statsCtrl.getSalesByDay);
router.get('/stats/top-clients/:boutiqueId', statsCtrl.getTopClients);

// Admin global stats
router.get('/stats/admin/global', statsCtrl.getGlobalStats);
router.get('/stats/admin/top-boutiques', statsCtrl.getTopBoutiques);
router.get('/stats/admin/categories-distribution', statsCtrl.getCategoriesDistribution);
router.get('/stats/admin/recent-users', statsCtrl.getRecentUsers);

///////////////////////////
// EMPLACEMENTS
///////////////////////////

router.get('/emplacements', emplacementCtrl.getAllEmplacements);
router.get('/emplacements/available', emplacementCtrl.getAvailableEmplacements);
router.get('/emplacements/:id', emplacementCtrl.getEmplacementById);
router.post('/emplacements', emplacementCtrl.createEmplacement);
router.put('/emplacements/:id', emplacementCtrl.updateEmplacement);
router.put('/emplacements/:id/assign', emplacementCtrl.assignBoutique);
router.delete('/emplacements/:id', emplacementCtrl.deleteEmplacement);

module.exports = router;
