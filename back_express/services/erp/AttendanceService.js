const AttendanceRepository = require('../../repositories/erp/AttendanceRepository');

const defaultFields = [
  'name', 'employee', 'employee_name', 'department', 'attendance_date', 'status', 
  'in_time', 'out_time', 'working_hours', 'early_exit', 'shift',
  'company', 'creation', 'modified_by'
];

// const defaultFields = ['*']

class AttendanceService {
  async getAllAttendances(fields = defaultFields) {
    return await AttendanceRepository.getAll({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
  }

  async getAttendanceByName(name, fields = defaultFields) {
    try {
      const results = await AttendanceRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch attendance ${name}: ${error.message}`);
    }
  }

  async getAttendanceByNameDetails(name, fields = defaultFields) {
    try {
      let params = {};
      
      if (fields) {
        params.fields = Array.isArray(fields) ? JSON.stringify(fields) : fields;
      }

      const result = await AttendanceRepository.getOne(name, params);
      return result;
    } catch (error) {
      throw new Error(`Unable to fetch attendance ${name}: ${error.message}`);
    }
  }

  async getAttendancesByEmployee(employee, fields = defaultFields) {
    return await AttendanceRepository.getAttendancesByEmployee(employee, fields);
  }

  async getAttendancesByDepartment(department, fields = defaultFields) {
    return await AttendanceRepository.getAttendancesByDepartment(department, fields);
  }

  async getAttendancesByStatus(status, fields = defaultFields) {
    return await AttendanceRepository.getAttendancesByStatus(status, fields);
  }

  async getAttendancesByDate(date, fields = defaultFields) {
    return await AttendanceRepository.getAttendancesByDate(date, fields);
  }

  async getAttendancesByDateRange(fromDate, toDate, fields = defaultFields) {
    return await AttendanceRepository.getAttendancesByDateRange(fromDate, toDate, fields);
  }

  async getPresentAttendances(fields = defaultFields) {
    return await AttendanceRepository.getAttendancesByStatus('Present', fields);
  }

  async getAbsentAttendances(fields = defaultFields) {
    return await AttendanceRepository.getAttendancesByStatus('Absent', fields);
  }

  async getLateAttendances(fields = defaultFields) {
    return await AttendanceRepository.search({ late_hours: ['>', 0] }, fields);
  }

  async searchAttendances(filters, fields = defaultFields) {
    return await AttendanceRepository.search(filters, fields);
  }

  async searchAttendancesBetweenDates(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await AttendanceRepository.searchBetweenDates('attendance_date', fromDate, toDate, extraFilters, fields);
  }

  async createAttendance(data) {
    return await AttendanceRepository.create(data); 
  }

  async createBulkAttendances(dataArray) {
    try {
      const results = [];
      for (const data of dataArray) {
        const result = await this.createAttendance(data);
        results.push(result);
      }
      return results;
    } catch (error) {
      throw new Error(`Unable to create bulk attendances: ${error.message}`);
    }
  }

  async updateAttendance(name, data) {
    return await AttendanceRepository.update(name, data);
  }

  async deleteAttendance(name) {
    return await AttendanceRepository.delete(name);
  }

  // Méthodes spécifiques au statut
  async markPresent(employee, date, inTime, outTime) {
    const attendanceData = {
      employee: employee,
      attendance_date: date,
      status: 'Present',
      in_time: inTime,
      out_time: outTime
    };
    return await this.createAttendance(attendanceData);
  }

  async markAbsent(employee, date) {
    const attendanceData = {
      employee: employee,
      attendance_date: date,
      status: 'Absent'
    };
    return await this.createAttendance(attendanceData);
  }

  async markHalfDay(employee, date, inTime, outTime) {
    const attendanceData = {
      employee: employee,
      attendance_date: date,
      status: 'Half Day',
      in_time: inTime,
      out_time: outTime
    };
    return await this.createAttendance(attendanceData);
  }

  // Méthodes avancées
  async getAttendanceWithDetails(name) {
    try {
      const [attendance, employeeDetails, shiftDetails] = await Promise.all([
        this.getAttendanceByName(name),
        this.getEmployeeDetails(name),
        this.getShiftDetails(name)
      ]);

      return {
        ...attendance,
        employee_details: employeeDetails,
        shift_details: shiftDetails
      };
    } catch (error) {
      throw new Error(`Unable to fetch attendance details for ${name}: ${error.message}`);
    }
  }

  async getEmployeeDetails(attendanceName) {
    try {
      const attendance = await this.getAttendanceByNameDetails(attendanceName, ['employee']);
      if (!attendance || !attendance.employee) return null;

      const EmployeeService = require('./EmployeeService');
      return await EmployeeService.getEmployeeByName(attendance.employee);
    } catch (error) {
      throw new Error(`Unable to fetch employee details for attendance ${attendanceName}: ${error.message}`);
    }
  }

  async getShiftDetails(attendanceName) {
    try {
      const attendance = await this.getAttendanceByNameDetails(attendanceName, ['shift']);
      if (!attendance || !attendance.shift) return null;

      const ShiftService = require('./ShiftService');
      return await ShiftService.getShiftByName(attendance.shift);
    } catch (error) {
      throw new Error(`Unable to fetch shift details for attendance ${attendanceName}: ${error.message}`);
    }
  }

  async calculateWorkingHours(name) {
    try {
      const attendance = await this.getAttendanceByName(name, ['in_time', 'out_time']);
      
      if (!attendance || !attendance.in_time || !attendance.out_time) {
        return null;
      }

      const inTime = new Date(`1970-01-01T${attendance.in_time}`);
      const outTime = new Date(`1970-01-01T${attendance.out_time}`);
      
      let workingHours = (outTime - inTime) / (1000 * 60 * 60); // Convertir en heures
      
      // Gérer le cas où out_time est après minuit
      if (workingHours < 0) {
        workingHours += 24;
      }

      return {
        working_hours: Math.round(workingHours * 100) / 100,
        in_time: attendance.in_time,
        out_time: attendance.out_time
      };
    } catch (error) {
      throw new Error(`Unable to calculate working hours for attendance ${name}: ${error.message}`);
    }
  }

  async calculateLateHours(name, shiftStartTime) {
    try {
      const attendance = await this.getAttendanceByName(name, ['in_time']);
      
      if (!attendance || !attendance.in_time) {
        return null;
      }

      const inTime = new Date(`1970-01-01T${attendance.in_time}`);
      const shiftStart = new Date(`1970-01-01T${shiftStartTime}`);
      
      let lateHours = (inTime - shiftStart) / (1000 * 60 * 60); // Convertir en heures
      
      if (lateHours < 0) {
        return { late_hours: 0, is_early: true };
      }

      return {
        late_hours: Math.round(lateHours * 100) / 100,
        in_time: attendance.in_time,
        shift_start: shiftStartTime
      };
    } catch (error) {
      throw new Error(`Unable to calculate late hours for attendance ${name}: ${error.message}`);
    }
  }

  async getEmployeeMonthlySummary(employee, year, month) {
    try {
      const fromDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const toDate = new Date(year, month, 0).toISOString().split('T')[0];
      
      const attendances = await this.getAttendancesByDateRange(fromDate, toDate, {
        employee: employee
      });

      const summary = {
        employee: employee,
        year: year,
        month: month,
        total_days: attendances.length,
        present: attendances.filter(a => a.status === 'Present').length,
        absent: attendances.filter(a => a.status === 'Absent').length,
        half_days: attendances.filter(a => a.status === 'Half Day').length,
        total_working_hours: attendances.reduce((sum, a) => sum + (a.working_hours || 0), 0),
        total_late_hours: attendances.reduce((sum, a) => sum + (a.late_hours || 0), 0),
        total_overtime_hours: attendances.reduce((sum, a) => sum + (a.overtime_hours || 0), 0)
      };

      summary.attendance_rate = summary.total_days > 0 ? 
        Math.round((summary.present / summary.total_days) * 100) : 0;

      return summary;
    } catch (error) {
      throw new Error(`Unable to fetch monthly summary for employee ${employee}: ${error.message}`);
    }
  }

  async getDepartmentDailySummary(department, date) {
    try {
      const attendances = await this.getAttendancesByDate(date, {
        department: department
      });

      const employees = [...new Set(attendances.map(a => a.employee))];
      
      const summary = {
        department: department,
        date: date,
        total_employees: employees.length,
        present: attendances.filter(a => a.status === 'Present').length,
        absent: attendances.filter(a => a.status === 'Absent').length,
        half_days: attendances.filter(a => a.status === 'Half Day').length,
        late_arrivals: attendances.filter(a => (a.late_hours || 0) > 0).length
      };

      summary.present_percentage = summary.total_employees > 0 ? 
        Math.round((summary.present / summary.total_employees) * 100) : 0;

      return summary;
    } catch (error) {
      throw new Error(`Unable to fetch daily summary for department ${department}: ${error.message}`);
    }
  }

  async importAttendancesFromBiometric(biometricData) {
    try {
      const attendances = [];
      
      for (const data of biometricData) {
        const attendance = await this.processBiometricRecord(data);
        attendances.push(attendance);
      }

      return await this.createBulkAttendances(attendances);
    } catch (error) {
      throw new Error(`Unable to import biometric data: ${error.message}`);
    }
  }

  async processBiometricRecord(biometricRecord) {
    // Logique de traitement des données biométriques
    const attendanceData = {
      employee: biometricRecord.employee_id,
      attendance_date: biometricRecord.date,
      in_time: biometricRecord.in_time,
      out_time: biometricRecord.out_time,
      status: 'Present', // Déterminer basé sur les heures
      device_id: biometricRecord.device_id
    };

    // Calculer les heures supplémentaires, retards, etc.
    const calculations = await this.calculateAttendanceMetrics(attendanceData);
    
    return {
      ...attendanceData,
      ...calculations
    };
  }

  async calculateAttendanceMetrics(attendanceData) {
    // Logique de calcul des métriques d'attendance
    const metrics = {
      working_hours: 0,
      late_hours: 0,
      overtime_hours: 0
    };

    if (attendanceData.in_time && attendanceData.out_time) {
      const workingHours = await this.calculateWorkingHoursFromTimes(
        attendanceData.in_time, 
        attendanceData.out_time
      );
      metrics.working_hours = workingHours;
    }

    return metrics;
  }

  async calculateWorkingHoursFromTimes(inTime, outTime) {
    const inTimeObj = new Date(`1970-01-01T${inTime}`);
    const outTimeObj = new Date(`1970-01-01T${outTime}`);
    
    let hours = (outTimeObj - inTimeObj) / (1000 * 60 * 60);
    if (hours < 0) hours += 24;
    
    return Math.round(hours * 100) / 100;
  }

  async getAttendanceStats(filters = {}) {
    try {
      const attendances = await this.searchAttendances(filters);
      
      const stats = {
        total: attendances.length,
        present: attendances.filter(a => a.status === 'Present').length,
        absent: attendances.filter(a => a.status === 'Absent').length,
        half_day: attendances.filter(a => a.status === 'Half Day').length,
        by_department: {},
        by_shift: {},
        average_working_hours: 0,
        total_late_hours: 0
      };

      // Statistiques par département et shift
      attendances.forEach(att => {
        if (att.department) {
          stats.by_department[att.department] = (stats.by_department[att.department] || 0) + 1;
        }
        
        if (att.shift) {
          stats.by_shift[att.shift] = (stats.by_shift[att.shift] || 0) + 1;
        }
        
        if (att.working_hours) {
          stats.average_working_hours += att.working_hours;
        }
        
        if (att.late_hours) {
          stats.total_late_hours += att.late_hours;
        }
      });

      if (attendances.length > 0) {
        stats.average_working_hours = Math.round((stats.average_working_hours / attendances.length) * 100) / 100;
      }

      stats.attendance_rate = stats.total > 0 ? 
        Math.round((stats.present / stats.total) * 100) : 0;

      return stats;
    } catch (error) {
      throw new Error(`Unable to fetch attendance stats: ${error.message}`);
    }
  }

  async getAttendancesByDateRangeWithStats(fromDate, toDate, extraFilters = {}) {
    try {
      const attendances = await this.searchAttendancesBetweenDates(
        fromDate, 
        toDate, 
        extraFilters
      );

      const stats = await this.getAttendanceStats({
        ...extraFilters,
        attendance_date: ['between', [fromDate, toDate]]
      });

      return {
        attendances,
        stats,
        dateRange: { fromDate, toDate }
      };
    } catch (error) {
      throw new Error(`Unable to fetch attendances with stats: ${error.message}`);
    }
  }

  async regularizeAttendance(name, regularizationData) {
    try {
      const updateData = {
        status: regularizationData.status,
        regularized: 1,
        regularization_reason: regularizationData.reason,
        regularized_by: regularizationData.regularized_by,
        regularization_date: new Date().toISOString().split('T')[0]
      };

      if (regularizationData.in_time) updateData.in_time = regularizationData.in_time;
      if (regularizationData.out_time) updateData.out_time = regularizationData.out_time;

      return await this.updateAttendance(name, updateData);
    } catch (error) {
      throw new Error(`Unable to regularize attendance: ${error.message}`);
    }
  }
}

module.exports = new AttendanceService();