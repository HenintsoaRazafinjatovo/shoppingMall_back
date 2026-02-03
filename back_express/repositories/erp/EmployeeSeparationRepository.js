const ERPRepository = require('./ERPRepository');

const doctype = 'Employee Separation'
class EmployeeSeparationRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
}

module.exports = new EmployeeSeparationRepository();
