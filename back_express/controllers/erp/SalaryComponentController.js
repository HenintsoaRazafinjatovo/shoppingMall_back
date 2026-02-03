const SalaryComponentService = require('../../services/erp/SalaryComponentService');

class SalaryComponentController {
  async getAll(req, res) {
    try {
      const { fields } = req.query;
      const salaryComponents = await SalaryComponentService.getAllSalaryComponents(fields);
      res.json(salaryComponents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const { fields } = req.query;
      const salaryComponent = await SalaryComponentService.getSalaryComponentByName(req.params.name, fields);
      
      if (!salaryComponent) {
        return res.status(404).json({ error: 'Salary Component not found' });
      }
      res.json(salaryComponent);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const salaryComponents = await SalaryComponentService.searchSalaryComponents(filters, fields);
      res.json(salaryComponents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const salaryComponents = await SalaryComponentService.searchSalaryComponentsBetweenDates(fromDate, toDate, extraFilters, fields);
      res.json(salaryComponents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchByCreationDate(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const salaryComponents = await SalaryComponentService.searchSalaryComponentsByCreationDate(fromDate, toDate, extraFilters, fields);
      res.json(salaryComponents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      // Validation des données
      const validation = await SalaryComponentService.validateSalaryComponent(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
      }

      const salaryComponent = await SalaryComponentService.createSalaryComponent(req.body);
      res.status(201).json(salaryComponent);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const salaryComponent = await SalaryComponentService.updateSalaryComponent(req.params.name, req.body);
      res.json(salaryComponent);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await SalaryComponentService.deleteSalaryComponent(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Routes spécifiques aux Salary Components
  async getByType(req, res) {
    try {
      const { fields } = req.query;
      const salaryComponents = await SalaryComponentService.getSalaryComponentsByType(req.params.type, fields);
      res.json(salaryComponents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByCategory(req, res) {
    try {
      const { fields } = req.query;
      const salaryComponents = await SalaryComponentService.getSalaryComponentsByCategory(req.params.category, fields);
      res.json(salaryComponents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByActiveStatus(req, res) {
    try {
      const { fields } = req.query;
      const isActive = req.params.isActive === 'true';
      const salaryComponents = await SalaryComponentService.getSalaryComponentsByActiveStatus(isActive, fields);
      res.json(salaryComponents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByCompany(req, res) {
    try {
      const { fields } = req.query;
      const salaryComponents = await SalaryComponentService.getSalaryComponentsByCompany(req.params.company, fields);
      res.json(salaryComponents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByFrequency(req, res) {
    try {
      const { fields } = req.query;
      const salaryComponents = await SalaryComponentService.getSalaryComponentsByFrequency(req.params.frequency, fields);
      res.json(salaryComponents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Routes utilitaires
  async getEarningComponents(req, res) {
    try {
      const { fields } = req.query;
      const earningComponents = await SalaryComponentService.getEarningComponents(fields);
      res.json(earningComponents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getDeductionComponents(req, res) {
    try {
      const { fields } = req.query;
      const deductionComponents = await SalaryComponentService.getDeductionComponents(fields);
      res.json(deductionComponents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getTaxComponents(req, res) {
    try {
      const { fields } = req.query;
      const taxComponents = await SalaryComponentService.getTaxComponents(fields);
      res.json(taxComponents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getFlexibleBenefitComponents(req, res) {
    try {
      const { fields } = req.query;
      const flexibleComponents = await SalaryComponentService.getFlexibleBenefitComponents(fields);
      res.json(flexibleComponents);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Routes avancées
  async calculateAmount(req, res) {
    try {
      const { name } = req.params;
      const { context } = req.body;
      
      const calculation = await SalaryComponentService.calculateComponentAmount(name, context || {});
      res.json(calculation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getComponentUsage(req, res) {
    try {
      const { name } = req.params;
      const usage = await SalaryComponentService.getComponentUsage(name);
      res.json(usage);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getStructuresUsingComponent(req, res) {
    try {
      const { name } = req.params;
      const structures = await SalaryComponentService.getStructuresUsingComponent(name);
      res.json(structures);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async bulkCreate(req, res) {
    try {
      const { components } = req.body;
      
      if (!components || !Array.isArray(components)) {
        return res.status(400).json({ error: 'components array is required' });
      }

      const results = await SalaryComponentService.bulkCreateSalaryComponents(components);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getComponentsSummary(req, res) {
    try {
      const summary = await SalaryComponentService.getComponentsSummary();
      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async validateComponent(req, res) {
    try {
      const validation = await SalaryComponentService.validateSalaryComponent(req.body);
      res.json(validation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

}

module.exports = new SalaryComponentController();