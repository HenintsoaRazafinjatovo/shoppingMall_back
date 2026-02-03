const PurchaseInvoiceRepository = require('../../repositories/erp/PurchaseInvoiceRepository');

const defaultFields = [
  'name', 
  'supplier', 
  'supplier_name',
  'posting_date',
  'due_date',
  'total',
  'total_taxes_and_charges',
  'grand_total',
  'status',
  'is_return',
  'bill_no',
  'bill_date',
  'currency',
  'conversion_rate',
  'company',
  'taxes_and_charges',
  'creation',
  'modified'
];

class PurchaseInvoiceService {
  async getAllPurchaseInvoices(fields = defaultFields) {
    return await PurchaseInvoiceRepository.getAll2  ({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
    // return await PurchaseInvoiceRepository.getAllWithoutFirst({ 
    //   fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    // });
  }

  async getPurchaseInvoiceByName(name, fields = defaultFields) {
    try {
      const results = await PurchaseInvoiceRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch purchase invoice ${name}: ${error.message}`);
    }
  }


  async getPurchaseInvoiceByNameDetails(name, fields = defaultFields) {
      try {
        let params = {};
        
        // Si fields est spécifié, l'utiliser, sinon ne pas inclure de paramètre fields
        if (fields) {
          params.fields = Array.isArray(fields) ? JSON.stringify(fields) : fields;
        }
  
        const result = await PurchaseInvoiceRepository.getOne(name, params);
        return result;
      } catch (error) {
        throw new Error(`Unable to fetch work order ${name}: ${error.message}`);
      }
    }

  async searchPurchaseInvoices(filters, fields = defaultFields) {
    return await PurchaseInvoiceRepository.search(filters, fields);
  }

  async searchPurchaseInvoicesBetweenDates(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await PurchaseInvoiceRepository.searchBetweenDates('posting_date', fromDate, toDate, extraFilters, fields);
  }

  async searchPurchaseInvoicesByCreationDate(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await PurchaseInvoiceRepository.searchBetweenDates('creation', fromDate, toDate, extraFilters, fields);
  }

  async createPurchaseInvoice(data) {
    return await PurchaseInvoiceRepository.create(data); 
  }

  async createAndSubmitPurchaseInvoice(data) {
    return await PurchaseInvoiceRepository.createAndSubmit(data); 
  }

  async updateWithCancelAndSubmitPurchaseInvoice(name, data) {
    return await PurchaseInvoiceRepository.updateWithCancelAndSubmit(name, data);
  }

  async updatePurchaseInvoice(name, data) {
    return await PurchaseInvoiceRepository.update(name, data);
  }

  async deletePurchaseInvoice(name) {
    return await PurchaseInvoiceRepository.delete(name);
  }

  // Méthodes spécifiques aux Purchase Invoices
  async getPurchaseInvoicesBySupplier(supplierName, fields = defaultFields) {
    return await PurchaseInvoiceRepository.search({ supplier: supplierName }, fields);
  }

  async getPurchaseInvoicesByStatus(status, fields = defaultFields) {
    return await PurchaseInvoiceRepository.search({ status: status }, fields);
  }

  async getPurchaseInvoicesByDateRange(fromDate, toDate, fields = defaultFields) {
    return await PurchaseInvoiceRepository.searchBetweenDates('posting_date', fromDate, toDate, {}, fields);
  }

  async getPurchaseInvoiceRequiredItems(name) {
    try {
      const purchaseInvoice = await this.getPurchaseInvoiceByNameDetails(name, ['items']);
      return purchaseInvoice ? purchaseInvoice.items : [];
    } catch (error) {
      throw new Error(`Unable to fetch required items for purchase invoice ${name}: ${error.message}`);
    }
  }

}

module.exports = new PurchaseInvoiceService();