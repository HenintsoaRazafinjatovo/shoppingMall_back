const ERPRepository = require('./ERPRepository');

const doctype = 'Salary Structure'
class SalaryStructureRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
}

module.exports = new SalaryStructureRepository();
