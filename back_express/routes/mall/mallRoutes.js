const express = require('express');
const router = express.Router();


// Controllers
// const UserController = require('../../controllers/app/userController');
const BoutiqueController = require('../../controllers/mall/BoutiqueController');
const ProductController = require('../../controllers/mall/ProductController');
const CategoryController = require('../../controllers/mall/CategoryController');
const CartController = require('../../controllers/mall/cartController');
const OrderController = require('../../controllers/mall/orderController');
const PromotionController = require('../../controllers/mall/promotionController');
const ReviewController = require('../../controllers/mall/reviewController');
const StockController = require('../../controllers/mall/stockController');


// Instances
// const userCtrl = new UserController();
const boutiqueCtrl = new BoutiqueController();
const productCtrl = new ProductController();
const categoryCtrl = new CategoryController();
const cartCtrl = new CartController();
const orderCtrl = new OrderController();
const promotionCtrl = new PromotionController();
const reviewCtrl = new ReviewController();
const stockCtrl = new StockController();

///////////////////////////
// USERS
///////////////////////////

// router.post('/users', userCtrl.createUser);
// router.get('/users', userCtrl.getAllUsers);
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
router.put('/boutiques/:id/validate', boutiqueCtrl.validateBoutique);
router.put('/boutiques/:id/suspend', boutiqueCtrl.suspendBoutique);

///////////////////////////
// PRODUCTS
///////////////////////////

router.get('/products',productCtrl.getAllProducts);
router.post('/products', productCtrl.createProduct);
router.get('/products/search', productCtrl.searchProduct);
router.get('/products/boutique/:boutiqueId', productCtrl.getProductsByBoutique);
router.get('/products/category/:categoryId', productCtrl.getProductsByCategory);

///////////////////////////
// CATEGORIES
///////////////////////////

router.post('/categories', categoryCtrl.createCategory);
router.get('/categories', categoryCtrl.getAllCategories);

///////////////////////////
// CART
///////////////////////////

router.get('/cart/:userId', cartCtrl.getCartByUser);
router.post('/cart/:userId', cartCtrl.addItemToCart);
router.delete('/cart/:userId', cartCtrl.clearCart);

///////////////////////////
// ORDERS
///////////////////////////

router.post('/orders', orderCtrl.createOrder);
router.get('/orders/user/:userId', orderCtrl.getOrdersByUser);
router.get('/orders/boutique/:boutiqueId', orderCtrl.getOrdersByBoutique);
router.put('/orders/item-status', orderCtrl.updateItemStatus);

///////////////////////////
// PROMOTIONS
///////////////////////////

router.post('/promotions', promotionCtrl.createPromotion);
router.post('/promotions/global', promotionCtrl.createGlobalPromotion);
router.get('/promotions/active', promotionCtrl.getActivePromotions);

///////////////////////////
// REVIEWS
///////////////////////////

router.post('/reviews', reviewCtrl.addReview);
router.get('/reviews/product/:productId', reviewCtrl.getReviewsByProduct);

///////////////////////////
// STOCK
///////////////////////////

router.put('/stocks', stockCtrl.updateStock);
router.get('/stocks/low', stockCtrl.getLowStockProducts);

module.exports = router;
