const SalarySlipService = require('../../services/erp/SalarySlipService');

class SalarySlipController {
  async getAll(req, res) {
    try {
      const { fields } = req.query;
      const salarySlips = await SalarySlipService.getAllSalarySlips(fields);
      res.json(salarySlips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const { fields } = req.query;
      const salarySlip = await SalarySlipService.getSalarySlipByName(req.params.name, fields);
      
      if (!salarySlip) {
        return res.status(404).json({ error: 'Salary Slip not found' });
      }
      res.json(salarySlip);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const salarySlips = await SalarySlipService.searchSalarySlips(filters, fields);
      res.json(salarySlips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const salarySlips = await SalarySlipService.searchSalarySlipsBetweenDates(fromDate, toDate, extraFilters, fields);
      res.json(salarySlips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchByCreationDate(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const salarySlips = await SalarySlipService.searchSalarySlipsByCreationDate(fromDate, toDate, extraFilters, fields);
      res.json(salarySlips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const salarySlip = await SalarySlipService.createSalarySlip(req.body);
      res.status(201).json(salarySlip);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const salarySlip = await SalarySlipService.updateSalarySlip(req.params.name, req.body);
      res.json(salarySlip);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await SalarySlipService.deleteSalarySlip(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Routes spécifiques aux Salary Slips
  async getByEmployee(req, res) {
    try {
      const { fields } = req.query;
      const salarySlips = await SalarySlipService.getSalarySlipsByEmployee(req.params.employee, fields);
      res.json(salarySlips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByPayrollEntry(req, res) {
    try {
      const { fields } = req.query;
      const salarySlips = await SalarySlipService.getSalarySlipsByPayrollEntry(req.params.payrollEntry, fields);
      res.json(salarySlips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByStatus(req, res) {
    try {
      const { fields } = req.query;
      const salarySlips = await SalarySlipService.getSalarySlipsByStatus(req.params.status, fields);
      res.json(salarySlips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByDepartment(req, res) {
    try {
      const { fields } = req.query;
      const salarySlips = await SalarySlipService.getSalarySlipsByDepartment(req.params.department, fields);
      res.json(salarySlips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByDateRange(req, res) {
    try {
      const { fromDate, toDate, fields } = req.query;
      const salarySlips = await SalarySlipService.getSalarySlipsByDateRange(fromDate, toDate, fields);
      res.json(salarySlips);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getEarnings(req, res) {
    try {
      const { name } = req.params;
      const earnings = await SalarySlipService.getSalarySlipEarnings(name);
      res.json(earnings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getDeductions(req, res) {
    try {
      const { name } = req.params;
      const deductions = await SalarySlipService.getSalarySlipDeductions(name);
      res.json(deductions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Route pour le résumé salarial
  async getEmployeeSalarySummary(req, res) {
    try {
      const { employee } = req.params;
      const { fromDate, toDate } = req.query;
      
      if (!fromDate || !toDate) {
        return res.status(400).json({ error: 'fromDate and toDate are required' });
      }

      const summary = await SalarySlipService.getSalarySummaryByEmployee(employee, fromDate, toDate);
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

}

module.exports = new SalarySlipController();