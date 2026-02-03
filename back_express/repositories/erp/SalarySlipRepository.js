const ERPRepository = require('./ERPRepository');

const doctype = 'Salary Slip'
class SalarySlipRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
}

module.exports = new SalarySlipRepository();
