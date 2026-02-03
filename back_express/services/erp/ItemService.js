const ItemRepository = require('../../repositories/erp/ItemRepository');

const defaultFields = ['name', 'item_name', 'item_group', 'stock_uom', 'is_stock_item', 'standard_rate', 'disabled']
class ItemService {
  // async getAllItems() {
  //   return await ItemRepository.getAll({ fields: JSON.stringify(defaultFields) });
  // }

  // async getItemByName(name) {
  //   const params = { fields: JSON.stringify(defaultFields) };
  //   return await ItemRepository.getOne(name, params);
  // }

  // async getItemByName(name) {
  //   const results = await ItemRepository.search({ name: name }, defaultFields);
  //   return results.length > 0 ? results[0] : null;
  // }

  // async searchItems(filters) {
  //   return await ItemRepository.search(filters, defaultFields);
  // }

  // async searchItemsBetweenDates(fromDate, toDate, extraFilters, fields) {
  //   return await ItemRepository.searchBetweenDates('creation', fromDate, toDate, extraFilters, fields);
  // }

  async getAllItems(fields = defaultFields) {
    return await ItemRepository.getAll({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
  }

  async getItemByName(name, fields = defaultFields) {
    try {
      const results = await ItemRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch item ${name}: ${error.message}`);
    }
  }

  async searchItems(filters, fields = defaultFields) {
    return await ItemRepository.search(filters, fields);
  }

  async searchItemsBetweenDates(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await ItemRepository.searchBetweenDates('creation', fromDate, toDate, extraFilters, fields);
  }

  async createItem(data) {
    return await ItemRepository.create(data); 
  }

  async createAndSubmitItem(data) {
    return await ItemRepository.createAndSubmit(data); 
  }

  async updateWithCancelAndSubmitItem(name, data) {
    return await ItemRepository.updateWithCancelAndSubmit(name, data);
  }

  async updateItem(name, data) {
    return await ItemRepository.update(name, data);
  }

  async deleteItem(name) {
    return await ItemRepository.delete(name);
  }
}

module.exports = new ItemService();