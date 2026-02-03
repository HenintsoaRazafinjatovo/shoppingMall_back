const ERPRepository = require('./ERPRepository');

const doctype = 'Bin'
class BinRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
}

module.exports = new BinRepository();
