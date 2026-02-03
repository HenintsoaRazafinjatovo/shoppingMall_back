const AttendanceService = require('../../services/erp/AttendanceService');

class AttendanceController {
  async getAll(req, res) {
    try {
      const { fields, status, date } = req.query;
      let attendances;
      
      if (status === 'present') {
        attendances = await AttendanceService.getPresentAttendances(fields);
      } else if (status === 'absent') {
        attendances = await AttendanceService.getAbsentAttendances(fields);
      } else if (status === 'late') {
        attendances = await AttendanceService.getLateAttendances(fields);
      } else if (date) {
        attendances = await AttendanceService.getAttendancesByDate(date, fields);
      } else {
        attendances = await AttendanceService.getAllAttendances(fields);
      }
      
      res.json(attendances);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const { fields, details } = req.query;
      let attendance;

      if (details === 'true') {
        attendance = await AttendanceService.getAttendanceWithDetails(req.params.name);
      } else {
        attendance = await AttendanceService.getAttendanceByName(req.params.name, fields);
      }

      if (!attendance) {
        return res.status(404).json({ error: 'Attendance record not found' });
      }
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByEmployee(req, res) {
    try {
      const { fields, fromDate, toDate } = req.query;
      const { employee } = req.params;
      
      let attendances;
      if (fromDate && toDate) {
        attendances = await AttendanceService.getAttendancesByDateRange(fromDate, toDate, { employee }, fields);
      } else {
        attendances = await AttendanceService.getAttendancesByEmployee(employee, fields);
      }
      
      res.json(attendances);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByDepartment(req, res) {
    try {
      const { fields, date } = req.query;
      const { department } = req.params;
      
      let attendances;
      if (date) {
        attendances = await AttendanceService.getAttendancesByDate(date, { department }, fields);
      } else {
        attendances = await AttendanceService.getAttendancesByDepartment(department, fields);
      }
      
      res.json(attendances);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getMonthlySummary(req, res) {
    try {
      const { employee, year, month } = req.params;
      const summary = await AttendanceService.getEmployeeMonthlySummary(employee, parseInt(year), parseInt(month));
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getDailySummary(req, res) {
    try {
      const { department, date } = req.params;
      const summary = await AttendanceService.getDepartmentDailySummary(department, date);
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async calculateWorkingHours(req, res) {
    try {
      const { name } = req.params;
      const workingHours = await AttendanceService.calculateWorkingHours(name);
      
      if (!workingHours) {
        return res.status(404).json({ error: 'Attendance record not found or missing time data' });
      }
      res.json(workingHours);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async calculateLateHours(req, res) {
    try {
      const { name } = req.params;
      const { shiftStartTime } = req.body;
      const lateHours = await AttendanceService.calculateLateHours(name, shiftStartTime);
      
      if (!lateHours) {
        return res.status(404).json({ error: 'Attendance record not found or missing in-time data' });
      }
      res.json(lateHours);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getStats(req, res) {
    try {
      const { filters } = req.body;
      const stats = await AttendanceService.getAttendanceStats(filters);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const attendances = await AttendanceService.searchAttendances(filters, fields);
      res.json(attendances);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const attendances = await AttendanceService.searchAttendancesBetweenDates(
        fromDate, 
        toDate, 
        extraFilters, 
        fields
      );
      res.json(attendances);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchWithStats(req, res) {
    try {
      const { fromDate, toDate, extraFilters } = req.body;
      const result = await AttendanceService.getAttendancesByDateRangeWithStats(
        fromDate, 
        toDate, 
        extraFilters
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const attendance = await AttendanceService.createAttendance(req.body);
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createBulk(req, res) {
    try {
      const attendances = await AttendanceService.createBulkAttendances(req.body);
      res.json(attendances);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async markPresent(req, res) {
    try {
      const { employee, date, inTime, outTime } = req.body;
      const attendance = await AttendanceService.markPresent(employee, date, inTime, outTime);
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async markAbsent(req, res) {
    try {
      const { employee, date } = req.body;
      const attendance = await AttendanceService.markAbsent(employee, date);
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async markHalfDay(req, res) {
    try {
      const { employee, date, inTime, outTime } = req.body;
      const attendance = await AttendanceService.markHalfDay(employee, date, inTime, outTime);
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async importBiometric(req, res) {
    try {
      const { biometricData } = req.body;
      const result = await AttendanceService.importAttendancesFromBiometric(biometricData);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const attendance = await AttendanceService.updateAttendance(req.params.name, req.body);
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async regularize(req, res) {
    try {
      const { name } = req.params;
      const result = await AttendanceService.regularizeAttendance(name, req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await AttendanceService.deleteAttendance(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AttendanceController();