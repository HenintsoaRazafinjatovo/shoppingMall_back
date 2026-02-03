const EmployeeService = require('../../services/erp/EmployeeService');

class EmployeeController {
  async getAll(req, res) {
    try {
      const { fields, status, department, designation } = req.query;
      let employees;
      
      if (status === 'active') {
        employees = await EmployeeService.getActiveEmployees(fields);
      } else if (status === 'inactive') {
        employees = await EmployeeService.getInactiveEmployees(fields);
      } else if (department) {
        employees = await EmployeeService.getEmployeesByDepartment(department, fields);
      } else if (designation) {
        employees = await EmployeeService.getEmployeesByDesignation(designation, fields);
      } else {
        employees = await EmployeeService.getAllEmployees(fields);
      }
      
      res.json(employees);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const { fields, details, profile } = req.query;
      let employee;

      if (profile === 'true') {
        employee = await EmployeeService.getEmployeeProfile(req.params.name);
      } else if (details === 'true') {
        employee = await EmployeeService.getEmployeeWithDetails(req.params.name);
      } else {
        employee = await EmployeeService.getEmployeeByName(req.params.name, fields);
      }

      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json(employee);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByEmployeeId(req, res) {
    try {
      const { fields } = req.query;
      const { employeeId } = req.params;
      const employee = await EmployeeService.getEmployeeByEmployeeId(employeeId, fields);
      
      if (!employee) {
        return res.status(404).json({ error: 'Employee not found' });
      }
      res.json(employee);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByManager(req, res) {
    try {
      const { fields } = req.query;
      const { managerId } = req.params;
      const employees = await EmployeeService.getEmployeesByManager(managerId, fields);
      res.json(employees);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByBranch(req, res) {
    try {
      const { fields } = req.query;
      const { branch } = req.params;
      const employees = await EmployeeService.getEmployeesByBranch(branch, fields);
      res.json(employees);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getDepartmentSummary(req, res) {
    try {
      const { department } = req.params;
      const summary = await EmployeeService.getDepartmentEmployeesSummary(department);
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getBirthdays(req, res) {
    try {
      const { month } = req.params;
      const birthdays = await EmployeeService.getEmployeesBirthdays(month);
      res.json(birthdays);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAnniversaries(req, res) {
    try {
      const { month } = req.params;
      const anniversaries = await EmployeeService.getWorkAnniversaries(month);
      res.json(anniversaries);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getTenure(req, res) {
    try {
      const { name } = req.params;
      const tenure = await EmployeeService.calculateEmployeeTenure(name);
      
      if (!tenure) {
        return res.status(404).json({ error: 'Employee not found or missing joining date' });
      }
      res.json(tenure);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getLeaveBalance(req, res) {
    try {
      const { name } = req.params;
      const leaveBalance = await EmployeeService.getEmployeeLeaveBalance(name);
      res.json(leaveBalance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getStats(req, res) {
    try {
      const { filters } = req.body;
      const stats = await EmployeeService.getEmployeeStats(filters);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const employees = await EmployeeService.searchEmployees(filters, fields);
      res.json(employees);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, field, extraFilters, fields } = req.body;
      const employees = await EmployeeService.searchEmployeesBetweenDates(
        fromDate, 
        toDate, 
        field || 'date_of_joining',
        extraFilters, 
        fields
      );
      res.json(employees);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchWithStats(req, res) {
    try {
      const { fromDate, toDate, extraFilters } = req.body;
      const result = await EmployeeService.getEmployeesByDateRangeWithStats(
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
      const employee = await EmployeeService.createEmployee(req.body);
      res.json(employee);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createWithUser(req, res) {
    try {
      const employee = await EmployeeService.createEmployeeWithUser(req.body);
      res.json(employee);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createFromApplicant(req, res) {
    try {
      const employee = await EmployeeService.createEmployeeFromApplicant(req.body);
      res.json(employee);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const employee = await EmployeeService.updateEmployee(req.params.name, req.body);
      res.json(employee);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateContactInfo(req, res) {
    try {
      const { name } = req.params;
      const employee = await EmployeeService.updateEmployeeContactInfo(name, req.body);
      res.json(employee);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateBankDetails(req, res) {
    try {
      const { name } = req.params;
      const employee = await EmployeeService.updateEmployeeBankDetails(name, req.body);
      res.json(employee);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { name } = req.params;
      const { status, relieving_date } = req.body;
      
      let result;
      switch (status) {
        case 'Active':
          result = await EmployeeService.activateEmployee(name);
          break;
        case 'Inactive':
          result = await EmployeeService.deactivateEmployee(name);
          break;
        case 'Left':
          result = await EmployeeService.markAsLeft(name, relieving_date);
          break;
        default:
          return res.status(400).json({ error: 'Invalid status' });
      }
      
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await EmployeeService.deleteEmployee(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new EmployeeController();