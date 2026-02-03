const ERPRepository = require('./ERPRepository');

const doctype = 'BOM'
class BOMRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
}

module.exports = new BOMRepository();
