const ERPRepository = require('./ERPRepository');

const doctype = 'Supplier'
class SupplierRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
}

module.exports = new SupplierRepository();
