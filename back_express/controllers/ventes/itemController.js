// const { callERPNextAPI } = require('../../services/erp/erpService');

// // Récupérer tous les items
// async function getItems(req, res) {
//   try {
//     const params = {
//     //   fields: JSON.stringify(["name", "item_name", "item_group", "stock_uom"]),
//       fields: JSON.stringify(["name", "country_of_origin"])
//     //   limit_page_length: 20
//     };
//     const data = await callERPNextAPI('/api/resource/Item', 'GET', null, params);
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// // Créer un nouvel item
// async function createItem(req, res) {
//   try {
//     const newItem = req.body;
//     const data = await callERPNextAPI('/api/resource/Item', 'POST',     );
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// // Récupérer un item par son nom
// async function getItemByName(req, res) {
//   try {
//     const { name } = req.params;
//     const data = await callERPNextAPI(`/api/resource/Item/${name}`, 'GET');
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

// module.exports = {
//   getItems,
//   createItem,
//   getItemByName
// };

const { callERPNextAPI } = require('../../services/erp/erpService');

// Récupérer tous les items
async function getItems(req, res) {
  try {
    const params = {
      fields: JSON.stringify(["name", "country_of_origin"]),
      limit_page_length: req.query.limit || 20,
      limit_start: req.query.offset || 0
    };
    
    // Ajout des filtres optionnels
    if (req.query.filters) {
      params.filters = JSON.stringify(req.query.filters);
    }
    
    const data = await callERPNextAPI('/api/resource/Item', 'GET', null, params);
    res.json({
      success: true,
      data: data.data,
      total: data.data.length
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}

// Créer un nouvel item
async function createItem(req, res) {
  try {
    const newItem = req.body;
    
    // Validation des données requises
    if (!newItem.item_code || !newItem.item_name) {
      return res.status(400).json({
        success: false,
        error: "item_code and item_name are required fields"
      });
    }

    const data = await callERPNextAPI(
      '/api/resource/Item', 
      'POST', 
      JSON.stringify(newItem)
    );
    
    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: data
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}

// Récupérer un item par son nom
async function getItemByName(req, res) {
  try {
    const { name } = req.params;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Item name is required"
      });
    }

    const data = await callERPNextAPI(`/api/resource/Item/${name}`, 'GET');
    
    res.json({
      success: true,
      data: data.data
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    
    // Gestion spécifique des erreurs 404
    if (error.message.includes('404')) {
      return res.status(404).json({
        success: false,
        error: "Item not found"
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}

// Mettre à jour un item
async function updateItem(req, res) {
  try {
    const { name } = req.params;
    const updateData = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Item name is required"
      });
    }

    const data = await callERPNextAPI(
      `/api/resource/Item/${name}`, 
      'PUT', 
      JSON.stringify(updateData)
    );
    
    res.json({
      success: true,
      message: 'Item updated successfully',
      data: data
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}

// Supprimer un item
async function deleteItem(req, res) {
  try {
    const { name } = req.params;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: "Item name is required"
      });
    }

    const data = await callERPNextAPI(
      `/api/resource/Item/${name}`, 
      'DELETE'
    );
    
    res.json({
      success: true,
      message: 'Item deleted successfully',
      data: data
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    
    if (error.message.includes('404')) {
      return res.status(404).json({
        success: false,
        error: "Item not found"
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}

module.exports = {
  getItems,
  createItem,
  getItemByName,
  updateItem,
  deleteItem
};