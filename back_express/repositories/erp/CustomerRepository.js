const ERPRepository = require('./ERPRepository');

const doctype = 'Customer'
class CustomerRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
}

module.exports = new CustomerRepository();
