const EmployeeSeparationRepository = require('../../repositories/erp/EmployeeSeparationRepository');

const defaultFields = [
  'name', 'employee', 'employee_name', 'department', 'designation',
  'resignation_letter_date', 'exit_interview',
  'boarding_status', 'company', 'creation'
];


// const defaultFields = ['*'];

class EmployeeSeparationService {
  async getAllSeparations(fields = defaultFields) {
    return await EmployeeSeparationRepository.getAll({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
  }

  async getSeparationByName(name, fields = defaultFields) {
    try {
      const results = await EmployeeSeparationRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch separation ${name}: ${error.message}`);
    }
  }

  async getSeparationByNameDetails(name, fields = defaultFields) {
    try {
      let params = {};
      
      if (fields) {
        params.fields = Array.isArray(fields) ? JSON.stringify(fields) : fields;
      }

      const result = await EmployeeSeparationRepository.getOne(name, params);
      return result;
    } catch (error) {
      throw new Error(`Unable to fetch separation ${name}: ${error.message}`);
    }
  }

  async getSeparationsByEmployee(employee, fields = defaultFields) {
    return await EmployeeSeparationRepository.getSeparationsByEmployee(employee, fields);
  }

  async getSeparationsByDepartment(department, fields = defaultFields) {
    return await EmployeeSeparationRepository.getSeparationsByDepartment(department, fields);
  }

  async getSeparationsByStatus(status, fields = defaultFields) {
    return await EmployeeSeparationRepository.getSeparationsByStatus(status, fields);
  }

  async getPendingSeparations(fields = defaultFields) {
    return await EmployeeSeparationRepository.getSeparationsByStatus('Pending', fields);
  }

  async getApprovedSeparations(fields = defaultFields) {
    return await EmployeeSeparationRepository.getSeparationsByStatus('Approved', fields);
  }

  async getRejectedSeparations(fields = defaultFields) {
    return await EmployeeSeparationRepository.getSeparationsByStatus('Rejected', fields);
  }

  async searchSeparations(filters, fields = defaultFields) {
    return await EmployeeSeparationRepository.search(filters, fields);
  }

  async searchSeparationsBetweenDates(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await EmployeeSeparationRepository.searchBetweenDates('creation', fromDate, toDate, extraFilters, fields);
  }

  async createSeparation(data) {
    return await EmployeeSeparationRepository.create(data); 
  }

  async createAndSubmitSeparation(data) {
    return await EmployeeSeparationRepository.createAndSubmit(data); 
  }

  async updateSeparation(name, data) {
    return await EmployeeSeparationRepository.update(name, data);
  }

  async deleteSeparation(name) {
    return await EmployeeSeparationRepository.delete(name);
  }

  // Méthodes spécifiques au statut
  async submitSeparation(name) {
    return await EmployeeSeparationRepository.updateStatus(name, 'Submitted');
  }

  async approveSeparation(name) {
    return await EmployeeSeparationRepository.updateStatus(name, 'Approved');
  }

  async rejectSeparation(name) {
    return await EmployeeSeparationRepository.updateStatus(name, 'Rejected');
  }

  async cancelSeparation(name) {
    return await EmployeeSeparationRepository.updateStatus(name, 'Cancelled');
  }

  // Méthodes avancées
  async getSeparationWithDetails(name) {
    try {
      const [separation, employeeDetails, clearance] = await Promise.all([
        this.getSeparationByName(name),
        this.getEmployeeDetails(name),
        this.getSeparationClearance(name)
      ]);

      return {
        ...separation,
        employee_details: employeeDetails,
        clearance_details: clearance
      };
    } catch (error) {
      throw new Error(`Unable to fetch separation details for ${name}: ${error.message}`);
    }
  }

  async getEmployeeDetails(separationName) {
    try {
      const separation = await this.getSeparationByNameDetails(separationName, ['employee']);
      if (!separation || !separation.employee) return null;

      // Récupérer les détails de l'employé depuis le module Employee
      const EmployeeService = require('./EmployeeService');
      return await EmployeeService.getEmployeeByName(separation.employee);
    } catch (error) {
      throw new Error(`Unable to fetch employee details for separation ${separationName}: ${error.message}`);
    }
  }

  async getSeparationClearance(name) {
    try {
      const separation = await this.getSeparationByNameDetails(name, [
        'clearance_status', 'assets_to_return', 'exit_interview_summary'
      ]);
      
      return {
        clearance_status: separation?.clearance_status || 'Pending',
        assets_to_return: separation?.assets_to_return || [],
        exit_interview_summary: separation?.exit_interview_summary || ''
      };
    } catch (error) {
      throw new Error(`Unable to fetch clearance details for separation ${name}: ${error.message}`);
    }
  }

  async getSeparationTimeline(name) {
    try {
      const separation = await this.getSeparationByNameDetails(name, [
        'creation', 'resignation_letter_date', 'resignation_acceptance_date',
        'last_working_date', 'modified'
      ]);

      if (!separation) return null;

      return {
        resignation_submitted: separation.resignation_letter_date,
        acceptance_date: separation.resignation_acceptance_date,
        last_working_day: separation.last_working_date,
        record_created: separation.creation,
        last_modified: separation.modified
      };
    } catch (error) {
      throw new Error(`Unable to fetch timeline for separation ${name}: ${error.message}`);
    }
  }

  async calculateNoticePeriod(name) {
    try {
      const separation = await this.getSeparationByName(name, [
        'resignation_letter_date', 'last_working_date'
      ]);

      if (!separation || !separation.resignation_letter_date || !separation.last_working_date) {
        return null;
      }

      const noticeStart = new Date(separation.resignation_letter_date);
      const noticeEnd = new Date(separation.last_working_date);
      const noticePeriodDays = Math.ceil((noticeEnd - noticeStart) / (1000 * 60 * 60 * 24));

      return {
        notice_period_days: noticePeriodDays,
        notice_start: separation.resignation_letter_date,
        notice_end: separation.last_working_date
      };
    } catch (error) {
      throw new Error(`Unable to calculate notice period for separation ${name}: ${error.message}`);
    }
  }

  async createSeparationFromResignation(employee, resignationData) {
    try {
      // Récupérer les détails de l'employé
      const EmployeeService = require('./EmployeeService');
      const employeeDetails = await EmployeeService.getEmployeeByName(employee);
      
      if (!employeeDetails) {
        throw new Error(`Employee ${employee} not found`);
      }

      const separationData = {
        employee: employee,
        employee_name: employeeDetails.employee_name,
        department: employeeDetails.department,
        designation: employeeDetails.designation,
        resignation_letter_date: resignationData.resignation_letter_date,
        last_working_date: resignationData.last_working_date,
        reason_for_leaving: resignationData.reason_for_leaving,
        status: 'Draft',
        company: employeeDetails.company,
        project: employeeDetails.project
      };

      return await this.createSeparation(separationData);
    } catch (error) {
      throw new Error(`Unable to create separation from resignation: ${error.message}`);
    }
  }

  async getSeparationStats(filters = {}) {
    try {
      const separations = await this.searchSeparations(filters);
      
      const stats = {
        total: separations.length,
        draft: separations.filter(s => s.status === 'Draft').length,
        submitted: separations.filter(s => s.status === 'Submitted').length,
        approved: separations.filter(s => s.status === 'Approved').length,
        rejected: separations.filter(s => s.status === 'Rejected').length,
        cancelled: separations.filter(s => s.status === 'Cancelled').length,
        by_department: {},
        by_reason: {}
      };

      // Statistiques par département
      separations.forEach(sep => {
        if (sep.department) {
          stats.by_department[sep.department] = (stats.by_department[sep.department] || 0) + 1;
        }
        
        if (sep.reason_for_leaving) {
          stats.by_reason[sep.reason_for_leaving] = (stats.by_reason[sep.reason_for_leaving] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      throw new Error(`Unable to fetch separation stats: ${error.message}`);
    }
  }

  async getSeparationsByDateRangeWithStats(fromDate, toDate, extraFilters = {}) {
    try {
      const separations = await this.searchSeparationsBetweenDates(
        fromDate, 
        toDate, 
        extraFilters
      );

      const stats = await this.getSeparationStats({
        ...extraFilters,
        creation: ['between', [fromDate, toDate]]
      });

      return {
        separations,
        stats,
        dateRange: { fromDate, toDate }
      };
    } catch (error) {
      throw new Error(`Unable to fetch separations with stats: ${error.message}`);
    }
  }

  async initiateExitProcess(name) {
    try {
      const separation = await this.getSeparationByName(name);
      if (!separation) {
        throw new Error(`Separation ${name} not found`);
      }

      if (separation.status !== 'Approved') {
        throw new Error('Separation must be approved before initiating exit process');
      }

      // Logique pour initier le processus de départ
      const exitData = {
        exit_process_initiated: 1,
        exit_initiation_date: new Date().toISOString().split('T')[0]
      };

      return await this.updateSeparation(name, exitData);
    } catch (error) {
      throw new Error(`Unable to initiate exit process: ${error.message}`);
    }
  }
}

module.exports = new EmployeeSeparationService();