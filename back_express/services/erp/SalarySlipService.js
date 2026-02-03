const SalarySlipRepository = require('../../repositories/erp/SalarySlipRepository');

const defaultFields = [
  'name',
  'employee',
  'employee_name',
  'department',
  'designation',
  'branch',
  'posting_date',
  'start_date',
  'end_date',
  'payroll_frequency',
  'payroll_entry',
  'company',
  'currency',
  'exchange_rate',
  'gross_pay',
  'total_deduction',
  'net_pay',
  'rounded_total',
  'total_in_words',
  'bank_name',
  'bank_account_no',
  'status',
  'creation',
  'modified'
];

class SalarySlipService {
  async getAllSalarySlips(fields = defaultFields) {
    return await SalarySlipRepository.getAll({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
  }

  async getSalarySlipByName(name, fields = defaultFields) {
    try {
      const results = await SalarySlipRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch Salary Slip ${name}: ${error.message}`);
    }
  }

  async getSalarySlipByNameDetails(name, fields = defaultFields) {
    try {
      let params = {};
      
      // Si fields est spécifié, l'utiliser, sinon ne pas inclure de paramètre fields
      if (fields) {
        params.fields = Array.isArray(fields) ? JSON.stringify(fields) : fields;
      }

      const result = await SalarySlipRepository.getOne(name, params);
      return result;
    } catch (error) {
      throw new Error(`Unable to fetch Salary Slip ${name}: ${error.message}`);
    }
  }

  async searchSalarySlips(filters, fields = defaultFields) {
    return await SalarySlipRepository.search(filters, fields);
  }

  async searchSalarySlipsBetweenDates(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await SalarySlipRepository.searchBetweenDates('posting_date', fromDate, toDate, extraFilters, fields);
  }

  async searchSalarySlipsByCreationDate(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await SalarySlipRepository.searchBetweenDates('creation', fromDate, toDate, extraFilters, fields);
  }

  async createSalarySlip(data) {
    return await SalarySlipRepository.create(data); 
  }

  async createAndSubmitSalarySlip(data) {
    return await SalarySlipRepository.createAndSubmit(data); 
  }

  async updateWithCancelAndSubmitSalarySlip(name, data) {
    return await SalarySlipRepository.updateWithCancelAndSubmit(name, data);
  }

  async updateSalarySlip(name, data) {
    return await SalarySlipRepository.update(name, data);
  }

  async deleteSalarySlip(name) {
    return await SalarySlipRepository.delete(name);
  }

  // Méthodes spécifiques aux Salary Slips
  async getSalarySlipsByEmployee(employee, fields = defaultFields) {
    return await SalarySlipRepository.search({ employee: employee }, fields);
  }

  async getSalarySlipsByPayrollEntry(payrollEntry, fields = defaultFields) {
    return await SalarySlipRepository.search({ payroll_entry: payrollEntry }, fields);
  }

  async getSalarySlipsByStatus(status, fields = defaultFields) {
    return await SalarySlipRepository.search({ status: status }, fields);
  }

  async getSalarySlipsByDepartment(department, fields = defaultFields) {
    return await SalarySlipRepository.search({ department: department }, fields);
  }

  async getSalarySlipsByDateRange(fromDate, toDate, fields = defaultFields) {
    return await SalarySlipRepository.searchBetweenDates('start_date', fromDate, toDate, {}, fields);
  }

  async getSalarySlipEarnings(name) {
    try {
      const salarySlip = await this.getSalarySlipByNameDetails(name, ['earnings']);
      return salarySlip ? salarySlip.earnings : [];
    } catch (error) {
      throw new Error(`Unable to fetch earnings for salary slip ${name}: ${error.message}`);
    }
  }

  async getSalarySlipDeductions(name) {
    try {
      const salarySlip = await this.getSalarySlipByNameDetails(name, ['deductions']);
      return salarySlip ? salarySlip.deductions : [];
    } catch (error) {
      throw new Error(`Unable to fetch deductions for salary slip ${name}: ${error.message}`);
    }
  }

  // Méthodes de calcul
  async getSalarySummaryByEmployee(employee, fromDate, toDate) {
    try {
      const salarySlips = await this.searchSalarySlipsBetweenDates(
        fromDate, 
        toDate, 
        { employee: employee, status: 'Submitted' }
      );
      
      const summary = {
        total_gross_pay: 0,
        total_deductions: 0,
        total_net_pay: 0,
        count: salarySlips.length
      };

      salarySlips.forEach(slip => {
        summary.total_gross_pay += slip.gross_pay || 0;
        summary.total_deductions += slip.total_deduction || 0;
        summary.total_net_pay += slip.net_pay || 0;
      });

      return summary;
    } catch (error) {
      throw new Error(`Unable to fetch salary summary for employee ${employee}: ${error.message}`);
    }
  }

}

module.exports = new SalarySlipService();