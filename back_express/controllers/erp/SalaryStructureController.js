const SalaryStructureService = require('../../services/erp/SalaryStructureService');

class SalaryStructureController {
  async getAll(req, res) {
    try {
      const { fields } = req.query;
      const salaryStructures = await SalaryStructureService.getAllSalaryStructures(fields);
      res.json(salaryStructures);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const { fields } = req.query;
      const salaryStructure = await SalaryStructureService.getSalaryStructureByName(req.params.name, fields);
      
      if (!salaryStructure) {
        return res.status(404).json({ error: 'Salary Structure not found' });
      }
      res.json(salaryStructure);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const salaryStructures = await SalaryStructureService.searchSalaryStructures(filters, fields);
      res.json(salaryStructures);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const salaryStructures = await SalaryStructureService.searchSalaryStructuresBetweenDates(fromDate, toDate, extraFilters, fields);
      res.json(salaryStructures);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchByCreationDate(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const salaryStructures = await SalaryStructureService.searchSalaryStructuresByCreationDate(fromDate, toDate, extraFilters, fields);
      res.json(salaryStructures);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const salaryStructure = await SalaryStructureService.createSalaryStructure(req.body);
      res.status(201).json(salaryStructure);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const salaryStructure = await SalaryStructureService.updateSalaryStructure(req.params.name, req.body);
      res.json(salaryStructure);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await SalaryStructureService.deleteSalaryStructure(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Routes spécifiques aux Salary Structures
  async getByEmployee(req, res) {
    try {
      const { fields } = req.query;
      const salaryStructures = await SalaryStructureService.getSalaryStructuresByEmployee(req.params.employee, fields);
      res.json(salaryStructures);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByCompany(req, res) {
    try {
      const { fields } = req.query;
      const salaryStructures = await SalaryStructureService.getSalaryStructuresByCompany(req.params.company, fields);
      res.json(salaryStructures);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByDepartment(req, res) {
    try {
      const { fields } = req.query;
      const salaryStructures = await SalaryStructureService.getSalaryStructuresByDepartment(req.params.department, fields);
      res.json(salaryStructures);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByDesignation(req, res) {
    try {
      const { fields } = req.query;
      const salaryStructures = await SalaryStructureService.getSalaryStructuresByDesignation(req.params.designation, fields);
      res.json(salaryStructures);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByStatus(req, res) {
    try {
      const { fields } = req.query;
      const salaryStructures = await SalaryStructureService.getSalaryStructuresByStatus(req.params.status, fields);
      res.json(salaryStructures);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByActiveStatus(req, res) {
    try {
      const { fields } = req.query;
      const isActive = req.params.isActive === 'true';
      const salaryStructures = await SalaryStructureService.getSalaryStructuresByActiveStatus(isActive, fields);
      res.json(salaryStructures);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByDateRange(req, res) {
    try {
      const { fromDate, toDate, fields } = req.query;
      const salaryStructures = await SalaryStructureService.getSalaryStructuresByDateRange(fromDate, toDate, fields);
      res.json(salaryStructures);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getEarnings(req, res) {
    try {
      const { name } = req.params;
      const earnings = await SalaryStructureService.getSalaryStructureEarnings(name);
      res.json(earnings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getDeductions(req, res) {
    try {
      const { name } = req.params;
      const deductions = await SalaryStructureService.getSalaryStructureDeductions(name);
      res.json(deductions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Routes avancées
  async getSalaryBreakdown(req, res) {
    try {
      const { name } = req.params;
      const breakdown = await SalaryStructureService.calculateSalaryBreakdown(name);
      res.json(breakdown);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async assignToEmployees(req, res) {
    try {
      const { structureName, employeeNames } = req.body;
      
      if (!structureName || !employeeNames || !Array.isArray(employeeNames)) {
        return res.status(400).json({ error: 'structureName and employeeNames array are required' });
      }

      const results = await SalaryStructureService.assignSalaryStructureToEmployees(structureName, employeeNames);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getActiveForEmployee(req, res) {
    try {
      const { employee } = req.params;
      const { date } = req.query;
      
      const targetDate = date ? new Date(date) : new Date();
      const salaryStructure = await SalaryStructureService.getActiveSalaryStructureForEmployee(employee, targetDate);
      
      if (!salaryStructure) {
        return res.status(404).json({ error: 'No active salary structure found for employee' });
      }
      
      res.json(salaryStructure);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async compareStructures(req, res) {
    try {
      const { structure1, structure2 } = req.body;
      
      if (!structure1 || !structure2) {
        return res.status(400).json({ error: 'structure1 and structure2 are required' });
      }

      const comparison = await SalaryStructureService.compareSalaryStructures(structure1, structure2);
      res.json(comparison);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

}

module.exports = new SalaryStructureController();