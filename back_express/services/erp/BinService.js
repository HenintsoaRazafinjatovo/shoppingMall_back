const BinRepository = require('../../repositories/erp/BinRepository');

// const defaultFields = [
//   'name',
//   'item_code',
//   'warehouse',
//   'actual_qty',
//   'reserved_qty',
//   'ordered_qty',
//   'projected_qty',
//   'valuation_rate',
//   'stock_value',
//   'stock_uom',
//   'item_name',
//   'description',
//   'item_group',
//   'brand',
//   'batch_no',
//   'serial_no',
//   'expiry_date',
//   'supplier',
//   'supplier_name',
//   'creation',
//   'modified',
//   'modified_by'
// ];

const defaultFields = ["*"];

class BinService {
  async getAllBins(fields = defaultFields) {
    return await BinRepository.getAll({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
  }

  async getBinByName(name, fields = defaultFields) {
    try {
      const results = await BinRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch Bin ${name}: ${error.message}`);
    }
  }

  async getBinByNameDetails(name, fields = defaultFields) {
    try {
      let params = {};
      
      if (fields) {
        params.fields = Array.isArray(fields) ? JSON.stringify(fields) : fields;
      }

      const result = await BinRepository.getOne(name, params);
      return result;
    } catch (error) {
      throw new Error(`Unable to fetch bin ${name}: ${error.message}`);
    }
  }

  async searchBins(filters, fields = defaultFields) {
    return await BinRepository.search(filters, fields);
  }

  async searchBinsBetweenDates(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await BinRepository.searchBetweenDates('creation', fromDate, toDate, extraFilters, fields);
  }

  async searchBinsByModifiedDate(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await BinRepository.searchBetweenDates('modified', fromDate, toDate, extraFilters, fields);
  }

  async createBin(data) {
    return await BinRepository.create(data); 
  }

  async updateBin(name, data) {
    return await BinRepository.update(name, data);
  }

  async deleteBin(name) {
    return await BinRepository.delete(name);
  }

  // Méthodes spécifiques aux Bins
  async getBinsByItemCode(itemCode, fields = defaultFields) {
    return await BinRepository.search({ item_code: itemCode }, fields);
  }

  async getBinsByWarehouse(warehouse, fields = defaultFields) {
    return await BinRepository.search({ warehouse: warehouse }, fields);
  }

  async getBinsByItemAndWarehouse(itemCode, warehouse, fields = defaultFields) {
    return await BinRepository.search({ 
      item_code: itemCode, 
      warehouse: warehouse 
    }, fields);
  }

  async getBinsWithLowStock(threshold = 0, fields = defaultFields) {
    return await BinRepository.search({ 
      actual_qty: ['<', threshold] 
    }, fields);
  }

  async getBinsWithZeroStock(fields = defaultFields) {
    return await BinRepository.search({ 
      actual_qty: 0 
    }, fields);
  }

  async getBinsByBatch(batchNo, fields = defaultFields) {
    return await BinRepository.search({ batch_no: batchNo }, fields);
  }

  async getBinsBySerial(serialNo, fields = defaultFields) {
    return await BinRepository.search({ serial_no: serialNo }, fields);
  }

  async getBinsExpiringBefore(date, fields = defaultFields) {
    return await BinRepository.search({ 
      expiry_date: ['<=', date] 
    }, fields);
  }

  async getStockValueByWarehouse(warehouse) {
    try {
      const bins = await this.getBinsByWarehouse(warehouse, ['stock_value', 'actual_qty']);
      const totalValue = bins.reduce((sum, bin) => sum + (bin.stock_value || 0), 0);
      const totalQty = bins.reduce((sum, bin) => sum + (bin.actual_qty || 0), 0);
      
      return {
        warehouse,
        total_stock_value: totalValue,
        total_quantity: totalQty,
        bin_count: bins.length
      };
    } catch (error) {
      throw new Error(`Unable to calculate stock value for warehouse ${warehouse}: ${error.message}`);
    }
  }

  async getStockSummaryByItem(itemCode) {
    try {
      const bins = await this.getBinsByItemCode(itemCode, [
        'warehouse', 
        'actual_qty', 
        'reserved_qty', 
        'ordered_qty', 
        'projected_qty',
        'stock_value'
      ]);
      
      const summary = {
        item_code: itemCode,
        total_actual_qty: bins.reduce((sum, bin) => sum + (bin.actual_qty || 0), 0),
        total_reserved_qty: bins.reduce((sum, bin) => sum + (bin.reserved_qty || 0), 0),
        total_ordered_qty: bins.reduce((sum, bin) => sum + (bin.ordered_qty || 0), 0),
        total_projected_qty: bins.reduce((sum, bin) => sum + (bin.projected_qty || 0), 0),
        total_stock_value: bins.reduce((sum, bin) => sum + (bin.stock_value || 0), 0),
        warehouses: bins.map(bin => ({
          warehouse: bin.warehouse,
          actual_qty: bin.actual_qty,
          reserved_qty: bin.reserved_qty,
          ordered_qty: bin.ordered_qty,
          projected_qty: bin.projected_qty,
          stock_value: bin.stock_value
        }))
      };
      
      return summary;
    } catch (error) {
      throw new Error(`Unable to get stock summary for item ${itemCode}: ${error.message}`);
    }
  }
}

module.exports = new BinService();