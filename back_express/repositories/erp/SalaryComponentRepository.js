const ERPRepository = require('./ERPRepository');

const doctype = 'Salary Component'
class SalaryComponentRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
}

module.exports = new SalaryComponentRepository();
