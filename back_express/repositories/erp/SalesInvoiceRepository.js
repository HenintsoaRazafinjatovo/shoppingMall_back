const ERPRepository = require('./ERPRepository');

const doctype = 'Sales Invoice'
class SalesInvoiceRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
}

module.exports = new SalesInvoiceRepository();
