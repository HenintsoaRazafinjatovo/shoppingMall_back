const TimesheetService = require('../../services/erp/TimesheetService');

class TimesheetController {
  async getAll(req, res) {
    try {
      const { fields, status, employee, project, date } = req.query;
      let timesheets;
      
      if (status === 'draft') {
        timesheets = await TimesheetService.getDraftTimesheets(fields);
      } else if (status === 'submitted') {
        timesheets = await TimesheetService.getSubmittedTimesheets(fields);
      } else if (status === 'approved') {
        timesheets = await TimesheetService.getApprovedTimesheets(fields);
      } else if (status === 'rejected') {
        timesheets = await TimesheetService.getRejectedTimesheets(fields);
      } else if (employee) {
        timesheets = await TimesheetService.getTimesheetsByEmployee(employee, fields);
      } else if (project) {
        timesheets = await TimesheetService.getTimesheetsByProject(project, fields);
      } else if (date) {
        timesheets = await TimesheetService.getTimesheetsByDate(date, fields);
      } else {
        timesheets = await TimesheetService.getAllTimesheets(fields);
      }
      
      res.json(timesheets);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const { fields, details } = req.query;
      let timesheet;

      if (details === 'true') {
        timesheet = await TimesheetService.getTimesheetWithDetails(req.params.name);
      } else {
        timesheet = await TimesheetService.getTimesheetByName(req.params.name, fields);
      }

      if (!timesheet) {
        return res.status(404).json({ error: 'Timesheet not found' });
      }
      res.json(timesheet);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByTask(req, res) {
    try {
      const { fields } = req.query;
      const { task } = req.params;
      const timesheets = await TimesheetService.getTimesheetsByTask(task, fields);
      res.json(timesheets);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getEmployeeSummary(req, res) {
    try {
      const { employee, fromDate, toDate } = req.params;
      const summary = await TimesheetService.getEmployeeTimesheetSummary(employee, fromDate, toDate);
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getProjectSummary(req, res) {
    try {
      const { project, fromDate, toDate } = req.params;
      const summary = await TimesheetService.getProjectTimesheetSummary(project, fromDate, toDate);
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getUtilization(req, res) {
    try {
      const { employee, fromDate, toDate } = req.params;
      const utilization = await TimesheetService.getTimesheetUtilization(employee, fromDate, toDate);
      res.json(utilization);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async calculateHours(req, res) {
    try {
      const { fromTime, toTime } = req.body;
      const hours = TimesheetService.calculateHours(fromTime, toTime);
      res.json({ fromTime, toTime, hours });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getStats(req, res) {
    try {
      const { filters } = req.body;
      const stats = await TimesheetService.getTimesheetStats(filters);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const timesheets = await TimesheetService.searchTimesheets(filters, fields);
      res.json(timesheets);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const timesheets = await TimesheetService.searchTimesheetsBetweenDates(
        fromDate, 
        toDate, 
        extraFilters, 
        fields
      );
      res.json(timesheets);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchWithStats(req, res) {
    try {
      const { fromDate, toDate, extraFilters } = req.body;
      const result = await TimesheetService.getTimesheetsByDateRangeWithStats(
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
      const timesheet = await TimesheetService.createTimesheet(req.body);
      res.json(timesheet);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createBulk(req, res) {
    try {
      const timesheets = await TimesheetService.createBulkTimesheets(req.body);
      res.json(timesheets);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async importFromTimer(req, res) {
    try {
      const { timerData } = req.body;
      const result = await TimesheetService.importTimesheetsFromTimer(timerData);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async copyPrevious(req, res) {
    try {
      const { employee, date } = req.body;
      const timesheets = await TimesheetService.copyPreviousTimesheet(employee, date);
      res.json(timesheets);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const timesheet = await TimesheetService.updateTimesheet(req.params.name, req.body);
      res.json(timesheet);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { name } = req.params;
      const { status, approved_by, rejection_reason } = req.body;
      
      let result;
      switch (status) {
        case 'Submitted':
          result = await TimesheetService.submitTimesheet(name);
          break;
        case 'Approved':
          result = await TimesheetService.approveTimesheet(name, approved_by);
          break;
        case 'Rejected':
          result = await TimesheetService.rejectTimesheet(name, rejection_reason);
          break;
        case 'Cancelled':
          result = await TimesheetService.cancelTimesheet(name);
          break;
        default:
          return res.status(400).json({ error: 'Invalid status' });
      }
      
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async approveBulk(req, res) {
    try {
      const { timesheet_names, approved_by } = req.body;
      const results = await TimesheetService.approveBulkTimesheets(timesheet_names, approved_by);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async submitBulk(req, res) {
    try {
      const { timesheet_names } = req.body;
      const results = await TimesheetService.submitBulkTimesheets(timesheet_names);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await TimesheetService.deleteTimesheet(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new TimesheetController();