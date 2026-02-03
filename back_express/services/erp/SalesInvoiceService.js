const SalesInvoiceRepository = require('../../repositories/erp/SalesInvoiceRepository');

const defaultFields = [
  'name', 
  'customer', 
  'customer_name',
  'posting_date',
  'due_date',
  'total',
  'total_taxes_and_charges',
  'grand_total',
  'status',
  'is_return',
  'currency',
  'conversion_rate',
  'selling_price_list',
  'total_qty',
  'base_total',
  'base_net_total',
  'total',
  'net_total',
  'base_grand_total',
  'base_rounded_total',
  'base_in_words',
  'grand_total',
  'rounded_total',
  'in_words',
  'debit_to',
  'against_income_account',
  'source',
  'company',
  'taxes_and_charges',
  'creation',
  'modified'
];

class SalesInvoiceService {
  async getAllSalesInvoices(fields = defaultFields) {
    return await SalesInvoiceRepository.getAll({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
  }

  async getSalesInvoiceByName(name, fields = defaultFields) {
    try {
      const results = await SalesInvoiceRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch Sales invoice ${name}: ${error.message}`);
    }
  }


  async getSalesInvoiceByNameDetails(name, fields = defaultFields) {
      try {
        let params = {};
        
        // Si fields est spécifié, l'utiliser, sinon ne pas inclure de paramètre fields
        if (fields) {
          params.fields = Array.isArray(fields) ? JSON.stringify(fields) : fields;
        }
  
        const result = await SalesInvoiceRepository.getOne(name, params);
        return result;
      } catch (error) {
        throw new Error(`Unable to fetch work order ${name}: ${error.message}`);
      }
    }

  async searchSalesInvoices(filters, fields = defaultFields) {
    return await SalesInvoiceRepository.search(filters, fields);
  }

  async searchSalesInvoicesBetweenDates(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await SalesInvoiceRepository.searchBetweenDates('posting_date', fromDate, toDate, extraFilters, fields);
  }

  async searchSalesInvoicesByCreationDate(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await SalesInvoiceRepository.searchBetweenDates('creation', fromDate, toDate, extraFilters, fields);
  }

  async createSalesInvoice(data) {
    return await SalesInvoiceRepository.create(data); 
  }

  async createAndSubmitSalesInvoice(data) {
    return await SalesInvoiceRepository.createAndSubmit(data); 
  }

  async updateWithCancelAndSubmitSalesInvoice(name, data) {
    return await SalesInvoiceRepository.updateWithCancelAndSubmit(name, data);
  }

  async updateSalesInvoice(name, data) {
    return await SalesInvoiceRepository.update(name, data);
  }

  async deleteSalesInvoice(name) {
    return await SalesInvoiceRepository.delete(name);
  }

  async deleteWithCancelSalesInvoice(name) {
    return await SalesInvoiceRepository.deleteWithCancel(name);
  }

  // Méthodes spécifiques aux Sales Invoices
  async getSalesInvoicesByCustomer(customerName, fields = defaultFields) {
    return await SalesInvoiceRepository.search({ customer: customerName }, fields);
  }

  async getSalesInvoicesByStatus(status, fields = defaultFields) {
    return await SalesInvoiceRepository.search({ status: status }, fields);
  }

  async getSalesInvoicesByDateRange(fromDate, toDate, fields = defaultFields) {
    return await SalesInvoiceRepository.searchBetweenDates('posting_date', fromDate, toDate, {}, fields);
  }

  async getSalesInvoiceRequiredItems(name) {
    try {
      const salesInvoice = await this.getSalesInvoiceByNameDetails(name, ['items']);
      return salesInvoice ? salesInvoice.items : [];
    } catch (error) {
      throw new Error(`Unable to fetch required items for sales invoice ${name}: ${error.message}`);
    }
  }

}

module.exports = new SalesInvoiceService();