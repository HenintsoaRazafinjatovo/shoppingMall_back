const BOMRepository = require('../../repositories/erp/BOMRepository');

const defaultFields = ['name', 'item', 'item_name','quantity', 'uom', 'routing', 'is_default', 'is_active', 'company', 'project', 'allow_alternative_item', 'transfer_material_against', 'with_operations', 'items'];

// Champs détaillés pour obtenir plus d'informations sur un BOM spécifique
const detailedFields = [
  'name', 
  'item', 
  'item_name',
  'quantity', 
  'uom', 
  'routing',
  'is_default', 
  'is_active', 
  'company', 
  'project',
  'allow_alternative_item', 
  'transfer_material_against', 
  'with_operations', 
  'items',
  'description',
  'creation',
  'modified',
  'owner',
  'modified_by',
  'docstatus'
];



class BOMService {
  async getAllBOMs(fields = defaultFields) {
    return await BOMRepository.getAll({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
  }

  async getBOMByName(name, fields = detailedFields) {
    try {
      const results = await BOMRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch BOM ${name}: ${error.message}`);
    }
  }

async getBOMByNameDetails(name, fields = defaultFields) {
  try {
    let params = {};
    
    // Si fields est spécifié, l'utiliser, sinon ne pas inclure de paramètre fields
    if (fields) {
      params.fields = Array.isArray(fields) ? JSON.stringify(fields) : fields;
    }
    
    const result = await BOMRepository.getOne(name, params);
    return result;
  } catch (error) {
    throw new Error(`Unable to fetch BOM ${name}: ${error.message}`);
  }
}

  async getBOMByItem(item, fields = defaultFields) {
    try {
      const results = await BOMRepository.search({ item: item }, fields);
      return results;
    } catch (error) {
      throw new Error(`Unable to fetch BOM for item ${item}: ${error.message}`);
    }
  }

  async getDefaultBOM(item, fields = defaultFields) {
    try {
      const results = await BOMRepository.search({ 
        item: item, 
        is_default: 1,
        is_active: 1 
      }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch default BOM for item ${item}: ${error.message}`);
    }
  }

  async searchBOMs(filters, fields = defaultFields) {
    return await BOMRepository.search(filters, fields);
  }

  async searchBOMsBetweenDates(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await BOMRepository.searchBetweenDates('creation', fromDate, toDate, extraFilters, fields);
  }

  async createBOM(data) {
    return await BOMRepository.create(data); 
  }

  async createAndSubmitBOM(data) {
    return await BOMRepository.createAndSubmit(data); 
  }

  async updateWithCancelAndSubmitBOM(name, data) {
    return await BOMRepository.updateWithCancelAndSubmit(name, data);
  }

  async updateBOM(name, data) {
    return await BOMRepository.update(name, data);
  }

  async updateWithCancelAndSubmitBOM(name, data) {
    return await BOMRepository.updateWithCancelAndSubmit(name, data);
  }

  async deleteBOM(name) {
    return await BOMRepository.delete(name);
  }

  async deleteWithCancelBOM(name) {
    return await BOMRepository.deleteWithCancel(name);
  }

//   async getBOMItems(bomName, fields = ['item_code', 'qty', 'uom', 'bom_no', 'rate', 'amount', 'operation', 'sourced_by_supplier']) {
//     try {
//       const bom = await this.getBOMByName(bomName, ['items']);
//       return bom ? bom.items : [];
//     } catch (error) {
//       throw new Error(`Unable to fetch BOM items for ${bomName}: ${error.message}`);
//     }
//   }

 async getBOMItems(bomName, fields = ['item_code', 'qty', 'uom', 'bom_no', 'rate', 'amount', 'operation', 'sourced_by_supplier']) {
    try {
      const bom = await this.getBOMByNameDetails(bomName);
      return bom && bom.exploded_items ? bom.exploded_items : [];
    } catch (error) {
      throw new Error(`Unable to fetch BOM items for ${bomName}: ${error.message}`);
    }
  }

  async getBOMOperations(bomName, fields = ['operation', 'time_in_mins', 'hour_rate', 'operating_cost', 'workstation', 'description']) {
    try {
      const bom = await this.getBOMByNameDetails(bomName, ['operations']);
      return bom ? bom.operations : [];
    } catch (error) {
      throw new Error(`Unable to fetch BOM operations for ${bomName}: ${error.message}`);
    }
  }
}

module.exports = new BOMService();