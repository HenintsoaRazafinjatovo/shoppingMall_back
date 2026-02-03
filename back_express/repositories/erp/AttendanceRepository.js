const ERPRepository = require('./ERPRepository');

const doctype = 'Attendance'
class AttendanceRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
}

module.exports = new AttendanceRepository();
