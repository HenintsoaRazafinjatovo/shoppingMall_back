const ERPRepository = require('./ERPRepository');

const doctype = 'Timesheet'
class TimesheetRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
}

module.exports = new TimesheetRepository();
