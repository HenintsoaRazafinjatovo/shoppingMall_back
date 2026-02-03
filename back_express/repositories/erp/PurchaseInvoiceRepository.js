const ERPRepository = require('./ERPRepository');

const doctype = 'Purchase Invoice'
class PurchaseInvoiceRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
}

module.exports = new PurchaseInvoiceRepository();
