const SalaryStructureRepository = require('../../repositories/erp/SalaryStructureRepository');

const defaultFields = [
  'name',
  'company',
  'currency',
  'payroll_frequency',
  'hour_rate',
  'salary_slip_based_on_timesheet',
  'amended_from',
  'is_active',
  'creation',
  'modified',
  'leave_encashment_amount_per_day',
  'max_benefits',
  'total_earning',
  'total_deduction',
  'net_pay'
];

class SalaryStructureService {
  async getAllSalaryStructures(fields = defaultFields) {
    return await SalaryStructureRepository.getAll({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
  }

  async getSalaryStructureByName(name, fields = defaultFields) {
    try {
      const results = await SalaryStructureRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch Salary Structure ${name}: ${error.message}`);
    }
  }

  async getSalaryStructureByNameDetails(name, fields = defaultFields) {
    try {
      let params = {};
      
      if (fields) {
        params.fields = Array.isArray(fields) ? JSON.stringify(fields) : fields;
      }

      const result = await SalaryStructureRepository.getOne(name, params);
      return result;
    } catch (error) {
      throw new Error(`Unable to fetch Salary Structure ${name}: ${error.message}`);
    }
  }

  async searchSalaryStructures(filters, fields = defaultFields) {
    return await SalaryStructureRepository.search(filters, fields);
  }

  async searchSalaryStructuresBetweenDates(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await SalaryStructureRepository.searchBetweenDates('from_date', fromDate, toDate, extraFilters, fields);
  }

  async searchSalaryStructuresByCreationDate(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await SalaryStructureRepository.searchBetweenDates('creation', fromDate, toDate, extraFilters, fields);
  }

  async createSalaryStructure(data) {
    return await SalaryStructureRepository.create(data); 
  }

  async createAndSubmitSalaryStructure(data) {
    return await SalaryStructureRepository.createAndSubmit(data); 
  }

  async updateWithCancelAndSubmitSalaryStructure(name, data) {
    return await SalaryStructureRepository.updateWithCancelAndSubmit(name, data);
  }

  async updateSalaryStructure(name, data) {
    return await SalaryStructureRepository.update(name, data);
  }

  async deleteSalaryStructure(name) {
    return await SalaryStructureRepository.delete(name);
  }

  // Méthodes spécifiques aux Salary Structures
  async getSalaryStructuresByEmployee(employee, fields = defaultFields) {
    return await SalaryStructureRepository.search({ employee: employee }, fields);
  }

  async getSalaryStructuresByCompany(company, fields = defaultFields) {
    return await SalaryStructureRepository.search({ company: company }, fields);
  }

  async getSalaryStructuresByDepartment(department, fields = defaultFields) {
    return await SalaryStructureRepository.search({ department: department }, fields);
  }

  async getSalaryStructuresByDesignation(designation, fields = defaultFields) {
    return await SalaryStructureRepository.search({ designation: designation }, fields);
  }

  async getSalaryStructuresByStatus(status, fields = defaultFields) {
    return await SalaryStructureRepository.search({ status: status }, fields);
  }

  async getSalaryStructuresByActiveStatus(isActive, fields = defaultFields) {
    return await SalaryStructureRepository.search({ is_active: isActive ? 1 : 0 }, fields);
  }

  async getSalaryStructuresByDateRange(fromDate, toDate, fields = defaultFields) {
    return await SalaryStructureRepository.searchBetweenDates('from_date', fromDate, toDate, {}, fields);
  }

  async getSalaryStructureEarnings(name) {
    try {
      const salaryStructure = await this.getSalaryStructureByNameDetails(name, ['earnings']);
      return salaryStructure ? salaryStructure.earnings : [];
    } catch (error) {
      throw new Error(`Unable to fetch earnings for salary structure ${name}: ${error.message}`);
    }
  }

  async getSalaryStructureDeductions(name) {
    try {
      const salaryStructure = await this.getSalaryStructureByNameDetails(name, ['deductions']);
      return salaryStructure ? salaryStructure.deductions : [];
    } catch (error) {
      throw new Error(`Unable to fetch deductions for salary structure ${name}: ${error.message}`);
    }
  }

  // Méthodes de calcul et d'analyse
  async calculateSalaryBreakdown(name) {
    try {
      const salaryStructure = await this.getSalaryStructureByNameDetails(name, [
        'earnings', 'deductions', 'base', 'variable', 'net_pay'
      ]);
      
      if (!salaryStructure) {
        throw new Error('Salary Structure not found');
      }

      const breakdown = {
        base_salary: salaryStructure.base || 0,
        variable_component: salaryStructure.variable || 0,
        total_earnings: salaryStructure.total_earning || 0,
        total_deductions: salaryStructure.total_deduction || 0,
        net_pay: salaryStructure.net_pay || 0,
        earnings_breakdown: [],
        deductions_breakdown: []
      };

      // Analyser les composantes de gains
      if (salaryStructure.earnings) {
        salaryStructure.earnings.forEach(earning => {
          breakdown.earnings_breakdown.push({
            salary_component: earning.salary_component,
            amount: earning.amount,
            formula: earning.formula
          });
        });
      }

      // Analyser les composantes de déductions
      if (salaryStructure.deductions) {
        salaryStructure.deductions.forEach(deduction => {
          breakdown.deductions_breakdown.push({
            salary_component: deduction.salary_component,
            amount: deduction.amount,
            formula: deduction.formula
          });
        });
      }

      return breakdown;
    } catch (error) {
      throw new Error(`Unable to calculate salary breakdown for structure ${name}: ${error.message}`);
    }
  }

  async assignSalaryStructureToEmployees(structureName, employeeNames) {
    try {
      const assignmentResults = [];
      
      for (const employeeName of employeeNames) {
        try {
          // Créer une nouvelle structure de salaire pour l'employé
          const newStructure = await this.createSalaryStructure({
            employee: employeeName,
            salary_structure: structureName,
            from_date: new Date().toISOString().split('T')[0],
            is_active: 1
          });
          
          assignmentResults.push({
            employee: employeeName,
            success: true,
            structure_name: newStructure.name
          });
        } catch (error) {
          assignmentResults.push({
            employee: employeeName,
            success: false,
            error: error.message
          });
        }
      }

      return assignmentResults;
    } catch (error) {
      throw new Error(`Unable to assign salary structure to employees: ${error.message}`);
    }
  }

  async getActiveSalaryStructureForEmployee(employee, date = new Date()) {
    try {
      const formattedDate = date.toISOString().split('T')[0];
      
      const structures = await this.searchSalaryStructures({
        employee: employee,
        is_active: 1,
        status: 'Active'
      });

      // Filtrer les structures actives à la date donnée
      const activeStructures = structures.filter(structure => {
        return (!structure.from_date || structure.from_date <= formattedDate) &&
               (!structure.to_date || structure.to_date >= formattedDate);
      });

      return activeStructures.length > 0 ? activeStructures[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch active salary structure for employee ${employee}: ${error.message}`);
    }
  }

  async compareSalaryStructures(structureName1, structureName2) {
    try {
      const [structure1, structure2] = await Promise.all([
        this.getSalaryStructureByNameDetails(structureName1),
        this.getSalaryStructureByNameDetails(structureName2)
      ]);

      if (!structure1 || !structure2) {
        throw new Error('One or both salary structures not found');
      }

      const comparison = {
        structure1: structure1.name,
        structure2: structure2.name,
        base_difference: (structure1.base || 0) - (structure2.base || 0),
        variable_difference: (structure1.variable || 0) - (structure2.variable || 0),
        net_pay_difference: (structure1.net_pay || 0) - (structure2.net_pay || 0),
        earnings_comparison: [],
        deductions_comparison: []
      };

      return comparison;
    } catch (error) {
      throw new Error(`Unable to compare salary structures: ${error.message}`);
    }
  }

}

module.exports = new SalaryStructureService();