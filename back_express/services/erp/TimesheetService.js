const TimesheetRepository = require('../../repositories/erp/TimesheetRepository');

const defaultFields = [
  'name', 'employee', 'employee_name', 'department','start_date', 'end_date', 'total_hours', 
  'total_billable_hours', 'status', 'company', 'creation', 'modified_by', 'modified'
];

// const defaultFields = ['*']

class TimesheetService {
  async getAllTimesheets(fields = defaultFields) {
    return await TimesheetRepository.getAll({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
  }

  async getTimesheetByName(name, fields = defaultFields) {
    try {
      const results = await TimesheetRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch timesheet ${name}: ${error.message}`);
    }
  }

  async getTimesheetByNameDetails(name, fields = defaultFields) {
    try {
      let params = {};
      
      if (fields) {
        params.fields = Array.isArray(fields) ? JSON.stringify(fields) : fields;
      }

      const result = await TimesheetRepository.getOne(name, params);
      return result;
    } catch (error) {
      throw new Error(`Unable to fetch timesheet ${name}: ${error.message}`);
    }
  }

  async getTimesheetsByEmployee(employee, fields = defaultFields) {
    return await TimesheetRepository.getTimesheetsByEmployee(employee, fields);
  }

  async getTimesheetsByProject(project, fields = defaultFields) {
    return await TimesheetRepository.getTimesheetsByProject(project, fields);
  }

  async getTimesheetsByTask(task, fields = defaultFields) {
    return await TimesheetRepository.getTimesheetsByTask(task, fields);
  }

  async getTimesheetsByStatus(status, fields = defaultFields) {
    return await TimesheetRepository.getTimesheetsByStatus(status, fields);
  }

  async getTimesheetsByDate(date, fields = defaultFields) {
    return await TimesheetRepository.getTimesheetsByDate(date, fields);
  }

  async getTimesheetsByDateRange(fromDate, toDate, fields = defaultFields) {
    return await TimesheetRepository.getTimesheetsByDateRange(fromDate, toDate, fields);
  }

  async getDraftTimesheets(fields = defaultFields) {
    return await TimesheetRepository.getTimesheetsByStatus('Draft', fields);
  }

  async getSubmittedTimesheets(fields = defaultFields) {
    return await TimesheetRepository.getTimesheetsByStatus('Submitted', fields);
  }

  async getApprovedTimesheets(fields = defaultFields) {
    return await TimesheetRepository.getTimesheetsByStatus('Approved', fields);
  }

  async getRejectedTimesheets(fields = defaultFields) {
    return await TimesheetRepository.getTimesheetsByStatus('Rejected', fields);
  }

  async getBillableTimesheets(fields = defaultFields) {
    return await TimesheetRepository.search({ billable: 1 }, fields);
  }

  async searchTimesheets(filters, fields = defaultFields) {
    return await TimesheetRepository.search(filters, fields);
  }

  async searchTimesheetsBetweenDates(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await TimesheetRepository.searchBetweenDates('timesheet_date', fromDate, toDate, extraFilters, fields);
  }

  async createTimesheet(data) {
    // Calculer automatiquement les heures si from_time et to_time sont fournis
    if (data.from_time && data.to_time && !data.hours) {
      data.hours = this.calculateHours(data.from_time, data.to_time);
    }

    // Calculer le montant facturable si applicable
    if (data.billable && data.billing_rate && data.hours) {
      data.billing_amount = data.billing_rate * data.hours;
    }

    return await TimesheetRepository.create(data); 
  }

  async createBulkTimesheets(dataArray) {
    try {
      const results = [];
      for (const data of dataArray) {
        const result = await this.createTimesheet(data);
        results.push(result);
      }
      return results;
    } catch (error) {
      throw new Error(`Unable to create bulk timesheets: ${error.message}`);
    }
  }

  async updateTimesheet(name, data) {
    // Recalculer les heures si from_time ou to_time sont modifiés
    if ((data.from_time || data.to_time) && !data.hours) {
      const existingTimesheet = await this.getTimesheetByName(name, ['from_time', 'to_time']);
      const fromTime = data.from_time || existingTimesheet.from_time;
      const toTime = data.to_time || existingTimesheet.to_time;
      
      if (fromTime && toTime) {
        data.hours = this.calculateHours(fromTime, toTime);
      }
    }

    // Recalculer le montant facturable si applicable
    if (data.billable !== undefined || data.billing_rate !== undefined || data.hours !== undefined) {
      const existingTimesheet = await this.getTimesheetByName(name, ['billable', 'billing_rate', 'hours']);
      const billable = data.billable !== undefined ? data.billable : existingTimesheet.billable;
      const billingRate = data.billing_rate !== undefined ? data.billing_rate : existingTimesheet.billing_rate;
      const hours = data.hours !== undefined ? data.hours : existingTimesheet.hours;

      if (billable && billingRate && hours) {
        data.billing_amount = billingRate * hours;
      }
    }

    return await TimesheetRepository.update(name, data);
  }

  async deleteTimesheet(name) {
    // return await TimesheetRepository.delete(name);
    return await TimesheetRepository.deleteWithCancel(name);
  }

  // Méthodes spécifiques au statut
  async submitTimesheet(name) {
    return await TimesheetRepository.updateStatus(name, 'Submitted');
  }

  async approveTimesheet(name, approvedBy) {
    const updateData = {
      status: 'Approved',
      approved_by: approvedBy,
      approval_date: new Date().toISOString().split('T')[0]
    };
    return await this.updateTimesheet(name, updateData);
  }

  async rejectTimesheet(name, rejectionReason) {
    const updateData = {
      status: 'Rejected',
      rejection_reason: rejectionReason
    };
    return await this.updateTimesheet(name, updateData);
  }

  async cancelTimesheet(name) {
    return await TimesheetRepository.updateStatus(name, 'Cancelled');
  }

  // Méthodes de calcul
  calculateHours(fromTime, toTime) {
    const from = new Date(`1970-01-01T${fromTime}`);
    const to = new Date(`1970-01-01T${toTime}`);
    
    let hours = (to - from) / (1000 * 60 * 60); // Convertir en heures
    
    // Gérer le cas où toTime est après minuit
    if (hours < 0) {
      hours += 24;
    }

    return Math.round(hours * 100) / 100;
  }

  // Méthodes avancées
  async getTimesheetWithDetails(name) {
    try {
      const [timesheet, employeeDetails, projectDetails, taskDetails] = await Promise.all([
        this.getTimesheetByName(name),
        this.getEmployeeDetails(name),
        this.getProjectDetails(name),
        this.getTaskDetails(name)
      ]);

      return {
        ...timesheet,
        employee_details: employeeDetails,
        project_details: projectDetails,
        task_details: taskDetails
      };
    } catch (error) {
      throw new Error(`Unable to fetch timesheet details for ${name}: ${error.message}`);
    }
  }

  async getEmployeeDetails(timesheetName) {
    try {
      const timesheet = await this.getTimesheetByNameDetails(timesheetName, ['employee']);
      if (!timesheet || !timesheet.employee) return null;

      const EmployeeService = require('./EmployeeService');
      return await EmployeeService.getEmployeeByName(timesheet.employee, ['employee_name', 'department', 'designation']);
    } catch (error) {
      throw new Error(`Unable to fetch employee details for timesheet ${timesheetName}: ${error.message}`);
    }
  }

  async getProjectDetails(timesheetName) {
    try {
      const timesheet = await this.getTimesheetByNameDetails(timesheetName, ['project']);
      if (!timesheet || !timesheet.project) return null;

      const ProjectService = require('./ProjectService');
      return await ProjectService.getProjectByName(timesheet.project, ['project_name', 'status', 'customer']);
    } catch (error) {
      throw new Error(`Unable to fetch project details for timesheet ${timesheetName}: ${error.message}`);
    }
  }

  async getTaskDetails(timesheetName) {
    try {
      const timesheet = await this.getTimesheetByNameDetails(timesheetName, ['task']);
      if (!timesheet || !timesheet.task) return null;

      const TaskService = require('./TaskService');
      return await TaskService.getTaskByName(timesheet.task, ['subject', 'status', 'priority']);
    } catch (error) {
      throw new Error(`Unable to fetch task details for timesheet ${timesheetName}: ${error.message}`);
    }
  }

  async getEmployeeTimesheetSummary(employee, fromDate, toDate) {
    try {
      const timesheets = await this.getTimesheetsByDateRange(fromDate, toDate, {
        employee: employee
      });

      const summary = {
        employee: employee,
        period: { fromDate, toDate },
        total_timesheets: timesheets.length,
        total_hours: timesheets.reduce((sum, ts) => sum + (ts.hours || 0), 0),
        billable_hours: timesheets.filter(ts => ts.billable).reduce((sum, ts) => sum + (ts.hours || 0), 0),
        non_billable_hours: timesheets.filter(ts => !ts.billable).reduce((sum, ts) => sum + (ts.hours || 0), 0),
        total_billing_amount: timesheets.reduce((sum, ts) => sum + (ts.billing_amount || 0), 0),
        by_project: {},
        by_activity_type: {},
        by_status: {}
      };

      timesheets.forEach(ts => {
        // Par projet
        if (ts.project) {
          if (!summary.by_project[ts.project]) {
            summary.by_project[ts.project] = {
              hours: 0,
              billable_amount: 0,
              count: 0
            };
          }
          summary.by_project[ts.project].hours += ts.hours || 0;
          summary.by_project[ts.project].billable_amount += ts.billing_amount || 0;
          summary.by_project[ts.project].count++;
        }

        // Par type d'activité
        if (ts.activity_type) {
          summary.by_activity_type[ts.activity_type] = (summary.by_activity_type[ts.activity_type] || 0) + (ts.hours || 0);
        }

        // Par statut
        if (ts.status) {
          summary.by_status[ts.status] = (summary.by_status[ts.status] || 0) + 1;
        }
      });

      summary.average_daily_hours = summary.total_hours / ((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24));

      return summary;
    } catch (error) {
      throw new Error(`Unable to fetch timesheet summary for employee ${employee}: ${error.message}`);
    }
  }

  async getProjectTimesheetSummary(project, fromDate, toDate) {
    try {
      const timesheets = await this.getTimesheetsByDateRange(fromDate, toDate, {
        project: project
      });

      const summary = {
        project: project,
        period: { fromDate, toDate },
        total_timesheets: timesheets.length,
        total_hours: timesheets.reduce((sum, ts) => sum + (ts.hours || 0), 0),
        billable_hours: timesheets.filter(ts => ts.billable).reduce((sum, ts) => sum + (ts.hours || 0), 0),
        total_billing_amount: timesheets.reduce((sum, ts) => sum + (ts.billing_amount || 0), 0),
        by_employee: {},
        by_task: {},
        by_activity_type: {}
      };

      timesheets.forEach(ts => {
        // Par employé
        if (ts.employee) {
          if (!summary.by_employee[ts.employee]) {
            summary.by_employee[ts.employee] = {
              hours: 0,
              billable_amount: 0,
              employee_name: ts.employee_name
            };
          }
          summary.by_employee[ts.employee].hours += ts.hours || 0;
          summary.by_employee[ts.employee].billable_amount += ts.billing_amount || 0;
        }

        // Par tâche
        if (ts.task) {
          summary.by_task[ts.task] = (summary.by_task[ts.task] || 0) + (ts.hours || 0);
        }

        // Par type d'activité
        if (ts.activity_type) {
          summary.by_activity_type[ts.activity_type] = (summary.by_activity_type[ts.activity_type] || 0) + (ts.hours || 0);
        }
      });

      return summary;
    } catch (error) {
      throw new Error(`Unable to fetch timesheet summary for project ${project}: ${error.message}`);
    }
  }

  async getTimesheetUtilization(employee, fromDate, toDate) {
    try {
      const timesheetSummary = await this.getEmployeeTimesheetSummary(employee, fromDate, toDate);
      
      // Récupérer les heures de travail attendues
      const AttendanceService = require('./AttendanceService');
      const workingDays = await AttendanceService.getAttendancesByDateRange(fromDate, toDate, {
        employee: employee,
        status: 'Present'
      });

      const totalWorkingHours = workingDays.length * 8; // Supposer 8 heures par jour

      const utilization = {
        employee: employee,
        period: { fromDate, toDate },
        total_worked_hours: timesheetSummary.total_hours,
        total_expected_hours: totalWorkingHours,
        utilization_rate: totalWorkingHours > 0 ? 
          Math.round((timesheetSummary.total_hours / totalWorkingHours) * 100) : 0,
        billable_utilization_rate: totalWorkingHours > 0 ? 
          Math.round((timesheetSummary.billable_hours / totalWorkingHours) * 100) : 0
      };

      return utilization;
    } catch (error) {
      throw new Error(`Unable to calculate utilization for employee ${employee}: ${error.message}`);
    }
  }

  async importTimesheetsFromTimer(timerData) {
    try {
      const timesheets = [];
      
      for (const data of timerData) {
        const timesheet = await this.processTimerRecord(data);
        timesheets.push(timesheet);
      }

      return await this.createBulkTimesheets(timesheets);
    } catch (error) {
      throw new Error(`Unable to import timer data: ${error.message}`);
    }
  }

  async processTimerRecord(timerRecord) {
    const timesheetData = {
      employee: timerRecord.employee_id,
      timesheet_date: timerRecord.date,
      from_time: timerRecord.start_time,
      to_time: timerRecord.end_time,
      hours: this.calculateHours(timerRecord.start_time, timerRecord.end_time),
      activity_type: timerRecord.activity_type || 'Development',
      project: timerRecord.project_id,
      task: timerRecord.task_id,
      description: timerRecord.description,
      billable: timerRecord.billable || true,
      billing_rate: timerRecord.billing_rate,
      status: 'Draft'
    };

    return timesheetData;
  }

  async approveBulkTimesheets(timesheetNames, approvedBy) {
    try {
      const results = [];
      for (const name of timesheetNames) {
        const result = await this.approveTimesheet(name, approvedBy);
        results.push(result);
      }
      return results;
    } catch (error) {
      throw new Error(`Unable to approve bulk timesheets: ${error.message}`);
    }
  }

  async submitBulkTimesheets(timesheetNames) {
    try {
      const results = [];
      for (const name of timesheetNames) {
        const result = await this.submitTimesheet(name);
        results.push(result);
      }
      return results;
    } catch (error) {
      throw new Error(`Unable to submit bulk timesheets: ${error.message}`);
    }
  }

  async getTimesheetStats(filters = {}) {
    try {
      const timesheets = await this.searchTimesheets(filters);
      
      const stats = {
        total: timesheets.length,
        draft: timesheets.filter(ts => ts.status === 'Draft').length,
        submitted: timesheets.filter(ts => ts.status === 'Submitted').length,
        approved: timesheets.filter(ts => ts.status === 'Approved').length,
        rejected: timesheets.filter(ts => ts.status === 'Rejected').length,
        total_hours: timesheets.reduce((sum, ts) => sum + (ts.hours || 0), 0),
        billable_hours: timesheets.filter(ts => ts.billable).reduce((sum, ts) => sum + (ts.hours || 0), 0),
        total_billing_amount: timesheets.reduce((sum, ts) => sum + (ts.billing_amount || 0), 0),
        by_project: {},
        by_employee: {},
        by_activity_type: {},
        by_status: {}
      };

      timesheets.forEach(ts => {
        // Par projet
        if (ts.project) {
          stats.by_project[ts.project] = (stats.by_project[ts.project] || 0) + (ts.hours || 0);
        }
        
        // Par employé
        if (ts.employee) {
          stats.by_employee[ts.employee] = (stats.by_employee[ts.employee] || 0) + (ts.hours || 0);
        }
        
        // Par type d'activité
        if (ts.activity_type) {
          stats.by_activity_type[ts.activity_type] = (stats.by_activity_type[ts.activity_type] || 0) + (ts.hours || 0);
        }
        
        // Par statut
        if (ts.status) {
          stats.by_status[ts.status] = (stats.by_status[ts.status] || 0) + 1;
        }
      });

      stats.billable_percentage = stats.total_hours > 0 ? 
        Math.round((stats.billable_hours / stats.total_hours) * 100) : 0;

      return stats;
    } catch (error) {
      throw new Error(`Unable to fetch timesheet stats: ${error.message}`);
    }
  }

  async getTimesheetsByDateRangeWithStats(fromDate, toDate, extraFilters = {}) {
    try {
      const timesheets = await this.searchTimesheetsBetweenDates(
        fromDate, 
        toDate, 
        extraFilters
      );

      const stats = await this.getTimesheetStats({
        ...extraFilters,
        timesheet_date: ['between', [fromDate, toDate]]
      });

      return {
        timesheets,
        stats,
        dateRange: { fromDate, toDate }
      };
    } catch (error) {
      throw new Error(`Unable to fetch timesheets with stats: ${error.message}`);
    }
  }

  async copyPreviousTimesheet(employee, date) {
    try {
      const previousDate = new Date(date);
      previousDate.setDate(previousDate.getDate() - 1);
      const previousDateStr = previousDate.toISOString().split('T')[0];

      const previousTimesheets = await this.getTimesheetsByDate(previousDateStr, {
        employee: employee
      });

      const newTimesheets = [];
      for (const ts of previousTimesheets) {
        const newTimesheet = {
          employee: ts.employee,
          timesheet_date: date,
          from_time: ts.from_time,
          to_time: ts.to_time,
          hours: ts.hours,
          activity_type: ts.activity_type,
          project: ts.project,
          task: ts.task,
          description: ts.description,
          billable: ts.billable,
          billing_rate: ts.billing_rate,
          status: 'Draft'
        };
        newTimesheets.push(newTimesheet);
      }

      return await this.createBulkTimesheets(newTimesheets);
    } catch (error) {
      throw new Error(`Unable to copy previous timesheet: ${error.message}`);
    }
  }
}

module.exports = new TimesheetService();