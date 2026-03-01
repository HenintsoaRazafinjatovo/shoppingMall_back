const mongoose = require('mongoose');

const StockTransactionSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  boutiqueId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Boutique', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['ENTREE', 'SORTIE', 'AJUSTEMENT', 'VENTE', 'RETOUR'],
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  previousStock: { 
    type: Number, 
    required: true 
  },
  newStock: { 
    type: Number, 
    required: true 
  },
  reason: { 
    type: String, 
    default: '' 
  },
  reference: { 
    type: String, 
    default: '' 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StockTransaction', StockTransactionSchema);
