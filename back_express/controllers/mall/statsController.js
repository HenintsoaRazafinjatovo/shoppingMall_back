const Order = require('../../models/Order');
const User = require('../../models/User');
const Boutique = require('../../models/Boutique');
const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Promotion = require('../../models/Promotion');
const mongoose = require('mongoose');

class StatsController {

  /**
   * GET /stats/top-products/:boutiqueId
   * Retourne les top produits les plus vendus
   */
  async getTopProducts(req, res) {
    try {
      const { boutiqueId } = req.params;
      const { month, year } = req.query;
      
      // Construction du filtre de date
      let dateFilter = {};
      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        dateFilter = { createdAt: { $gte: startDate, $lte: endDate } };
      }
      
      const pipeline = [
        // Filtrer par boutique dans les items
        { $unwind: '$items' },
        { $match: { 
          'items.boutiqueId': new mongoose.Types.ObjectId(boutiqueId),
          paymentStatus: { $ne: 'CANCELLED' },
          ...dateFilter
        }},
        // Grouper par produit
        { $group: {
          _id: '$items.productId',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }},
        // Trier par quantité vendue
        { $sort: { totalQuantity: -1 } },
        // Limiter à 5
        { $limit: 5 },
        // Joindre les infos produit
        { $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }},
        { $unwind: '$product' },
        // Projeter les champs voulus
        { $project: {
          _id: 1,
          nom: '$product.name',
          ventes: '$totalQuantity',
          revenue: '$totalRevenue'
        }}
      ];
      
      const topProducts = await Order.aggregate(pipeline);
      
      res.json({
        success: true,
        data: topProducts
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /stats/sales-by-day/:boutiqueId
   * Retourne les ventes par jour de la semaine (derniers 7 jours)
   */
  async getSalesByDay(req, res) {
    try {
      const { boutiqueId } = req.params;
      
      // Derniers 7 jours (incluant aujourd'hui)
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      
      const pipeline = [
        { $unwind: '$items' },
        { $match: {
          'items.boutiqueId': new mongoose.Types.ObjectId(boutiqueId),
          paymentStatus: { $ne: 'CANCELLED' },
          createdAt: { $gte: startDate, $lte: endDate }
        }},
        // Grouper par date
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalVentes: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }},
        { $sort: { _id: 1 } }
      ];
      
      const salesData = await Order.aggregate(pipeline);
      
      // Créer un tableau pour les 7 derniers jours
      const joursSemaine = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      const result = [];
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = joursSemaine[date.getDay()];
        
        const found = salesData.find(d => d._id === dateStr);
        result.push({
          jour: dayName,
          date: dateStr,
          ventes: found ? found.totalVentes : 0,
          revenue: found ? found.totalRevenue : 0
        });
      }
      
      res.json({
        success: true,
        data: result
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /stats/top-clients/:boutiqueId
   * Retourne les top clients par montant dépensé
   */
  async getTopClients(req, res) {
    try {
      const { boutiqueId } = req.params;
      const { month, year } = req.query;
      
      // Construction du filtre de date
      let dateFilter = {};
      if (month && year) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        dateFilter = { createdAt: { $gte: startDate, $lte: endDate } };
      }
      
      const pipeline = [
        { $unwind: '$items' },
        { $match: {
          'items.boutiqueId': new mongoose.Types.ObjectId(boutiqueId),
          paymentStatus: { $ne: 'CANCELLED' },
          ...dateFilter
        }},
        // Grouper par client
        { $group: {
          _id: '$userId',
          totalDepense: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          nombreCommandes: { $sum: 1 }
        }},
        { $sort: { totalDepense: -1 } },
        { $limit: 5 },
        // Joindre les infos utilisateur
        { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }},
        { $unwind: '$user' },
        { $project: {
          _id: 1,
          nom: '$user.fullName',
          email: '$user.email',
          total: '$totalDepense',
          commandes: '$nombreCommandes'
        }}
      ];
      
      const topClients = await Order.aggregate(pipeline);
      
      res.json({
        success: true,
        data: topClients
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /stats/admin/global
   * Retourne les statistiques globales pour l'admin du centre commercial
   */
  async getGlobalStats(req, res) {
    try {
      // Compter les boutiques
      const totalBoutiques = await Boutique.countDocuments();
      const boutiquesValidees = await Boutique.countDocuments({ isValidated: true });
      const boutiquesEnAttente = await Boutique.countDocuments({ isValidated: false });

      // Compter les utilisateurs
      const totalUsers = await User.countDocuments();
      const usersActifs = await User.countDocuments({ isActive: true });

      // Compter les produits
      const totalProducts = await Product.countDocuments();

      // Compter les commandes et calculer le revenu total
      const ordersStats = await Order.aggregate([
        { $match: { paymentStatus: { $ne: 'CANCELLED' } } },
        { $group: {
          _id: null,
          total: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }}
      ]);

      // Compter les promotions actives
      const now = new Date();
      const promotionsActives = await Promotion.countDocuments({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
      });

      // Compter les catégories
      const totalCategories = await Category.countDocuments();

      res.json({
        success: true,
        data: {
          boutiques: {
            total: totalBoutiques,
            validees: boutiquesValidees,
            enAttente: boutiquesEnAttente
          },
          utilisateurs: {
            total: totalUsers,
            actifs: usersActifs
          },
          produits: totalProducts,
          commandes: {
            total: ordersStats[0]?.total || 0,
            revenue: ordersStats[0]?.revenue || 0
          },
          promotions: promotionsActives,
          categories: totalCategories
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /stats/admin/top-boutiques
   * Retourne les top boutiques par revenu
   */
  async getTopBoutiques(req, res) {
    try {
      const pipeline = [
        { $match: { paymentStatus: { $ne: 'CANCELLED' } } },
        { $unwind: '$items' },
        { $group: {
          _id: '$items.boutiqueId',
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalCommandes: { $sum: 1 },
          totalProduits: { $sum: '$items.quantity' }
        }},
        { $sort: { totalRevenue: -1 } },
        { $limit: 10 },
        { $lookup: {
          from: 'boutiques',
          localField: '_id',
          foreignField: '_id',
          as: 'boutique'
        }},
        { $unwind: '$boutique' },
        { $project: {
          _id: 1,
          nom: '$boutique.name',
          logo: '$boutique.logo',
          revenue: '$totalRevenue',
          commandes: '$totalCommandes',
          produits: '$totalProduits'
        }}
      ];

      const topBoutiques = await Order.aggregate(pipeline);

      res.json({
        success: true,
        data: topBoutiques
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /stats/admin/categories-distribution
   * Retourne la distribution des produits par catégorie
   */
  async getCategoriesDistribution(req, res) {
    try {
      const pipeline = [
        { $group: {
          _id: '$categoryId',
          count: { $sum: 1 }
        }},
        { $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }},
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        { $project: {
          _id: 1,
          nom: { $ifNull: ['$category.name', 'Sans catégorie'] },
          count: 1
        }},
        { $sort: { count: -1 } }
      ];

      const distribution = await Product.aggregate(pipeline);

      res.json({
        success: true,
        data: distribution
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * GET /stats/admin/recent-users
   * Retourne les utilisateurs récemment inscrits
   */
  async getRecentUsers(req, res) {
    try {
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('fullName email role createdAt isActive profilePicturePath');

      res.json({
        success: true,
        data: recentUsers
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = StatsController;
