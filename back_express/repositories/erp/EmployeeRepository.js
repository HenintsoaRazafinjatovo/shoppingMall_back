const ERPRepository = require('./ERPRepository');

const doctype = 'Employee'
class EmployeeRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
}

module.exports = new EmployeeRepository();
