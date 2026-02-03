const ERPRepository = require('./ERPRepository');

const doctype = 'Item'
class ItemRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
}

module.exports = new ItemRepository();
