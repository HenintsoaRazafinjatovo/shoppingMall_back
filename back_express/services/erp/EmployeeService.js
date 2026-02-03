const EmployeeRepository = require('../../repositories/erp/EmployeeRepository');

const defaultFields = [
  'name', 'employee', 'employee_name', 'first_name', 'last_name', 
  'gender', 'date_of_birth', 'date_of_joining', 'department', 
  'designation', 'company', 'branch', 'employment_type', 'status',
  'reports_to', 'prefered_email', 'personal_email', 'company_email', 
  'current_address', 'permanent_address', 'blood_group', 'marital_status',
  'bank_name', 'salary_mode', 'payroll_cost_center', 'grade', 
  'holiday_list', 'default_shift', 'creation', 'modified'
];

// const defaultFields = ['*']

class EmployeeService {
  async getAllEmployees(fields = defaultFields) {
    return await EmployeeRepository.getAll({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
  }

  async getEmployeeByName(name, fields = defaultFields) {
    try {
      const results = await EmployeeRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch employee ${name}: ${error.message}`);
    }
  }

  async getEmployeeByEmployeeId(employeeId, fields = defaultFields) {
    try {
      const results = await EmployeeRepository.search({ employee: employeeId }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch employee ${employeeId}: ${error.message}`);
    }
  }

  async getEmployeeByNameDetails(name, fields = defaultFields) {
    try {
      let params = {};
      
      if (fields) {
        params.fields = Array.isArray(fields) ? JSON.stringify(fields) : fields;
      }

      const result = await EmployeeRepository.getOne(name, params);
      return result;
    } catch (error) {
      throw new Error(`Unable to fetch employee ${name}: ${error.message}`);
    }
  }

  async getEmployeesByDepartment(department, fields = defaultFields) {
    return await EmployeeRepository.getEmployeesByDepartment(department, fields);
  }

  async getEmployeesByDesignation(designation, fields = defaultFields) {
    return await EmployeeRepository.getEmployeesByDesignation(designation, fields);
  }

  async getEmployeesByStatus(status, fields = defaultFields) {
    return await EmployeeRepository.getEmployeesByStatus(status, fields);
  }

  async getEmployeesByEmploymentType(employmentType, fields = defaultFields) {
    return await EmployeeRepository.getEmployeesByEmploymentType(employmentType, fields);
  }

  async getActiveEmployees(fields = defaultFields) {
    return await EmployeeRepository.getEmployeesByStatus('Active', fields);
  }

  async getInactiveEmployees(fields = defaultFields) {
    return await EmployeeRepository.getEmployeesByStatus('Inactive', fields);
  }

  async getEmployeesByBranch(branch, fields = defaultFields) {
    return await EmployeeRepository.getEmployeesByBranch(branch, fields);
  }

  async getEmployeesByManager(managerId, fields = defaultFields) {
    return await EmployeeRepository.getEmployeesByManager(managerId, fields);
  }

  async searchEmployees(filters, fields = defaultFields) {
    return await EmployeeRepository.search(filters, fields);
  }

  async searchEmployeesBetweenDates(fromDate, toDate, field = 'date_of_joining', extraFilters = {}, fields = defaultFields) {
    return await EmployeeRepository.searchBetweenDates(field, fromDate, toDate, extraFilters, fields);
  }

  async createEmployee(data) {
    return await EmployeeRepository.create(data); 
  }

  async createEmployeeWithUser(data) {
    try {
      // Créer d'abord l'employé
      const employee = await this.createEmployee(data);
      
      // Créer l'utilisateur associé
      if (data.create_user_account) {
        const UserService = require('./UserService');
        const userData = {
          email: data.company_email || data.personal_email,
          first_name: data.first_name,
          last_name: data.last_name,
          employee: employee.name,
          role: data.user_role || 'Employee'
        };
        await UserService.createUser(userData);
      }
      
      return employee;
    } catch (error) {
      throw new Error(`Unable to create employee with user account: ${error.message}`);
    }
  }

  async updateEmployee(name, data) {
    return await EmployeeRepository.update(name, data);
  }

  async deleteEmployee(name) {
    return await EmployeeRepository.delete(name);
  }

  // Méthodes spécifiques au statut
  async activateEmployee(name) {
    return await EmployeeRepository.updateStatus(name, 'Active');
  }

  async deactivateEmployee(name) {
    return await EmployeeRepository.updateStatus(name, 'Inactive');
  }

  async markAsLeft(name, relievingDate) {
    const updateData = {
      status: 'Left',
      relieving_date: relievingDate,
      date_of_leaving: relievingDate
    };
    return await this.updateEmployee(name, updateData);
  }

  // Méthodes avancées
  async getEmployeeWithDetails(name) {
    try {
      const [employee, reportingTo, subordinates, salary, attendance] = await Promise.all([
        this.getEmployeeByName(name),
        this.getReportingManagerDetails(name),
        this.getSubordinates(name),
        this.getSalaryDetails(name),
        this.getRecentAttendance(name)
      ]);

      return {
        ...employee,
        reporting_manager: reportingTo,
        subordinates: subordinates,
        salary_details: salary,
        recent_attendance: attendance
      };
    } catch (error) {
      throw new Error(`Unable to fetch employee details for ${name}: ${error.message}`);
    }
  }

  async getReportingManagerDetails(employeeName) {
    try {
      const employee = await this.getEmployeeByNameDetails(employeeName, ['reports_to']);
      if (!employee || !employee.reports_to) return null;

      return await this.getEmployeeByName(employee.reports_to, ['employee_name', 'designation', 'department']);
    } catch (error) {
      throw new Error(`Unable to fetch reporting manager details for employee ${employeeName}: ${error.message}`);
    }
  }

  async getSubordinates(employeeName) {
    try {
      return await this.getEmployeesByManager(employeeName, ['employee', 'employee_name', 'designation', 'department']);
    } catch (error) {
      throw new Error(`Unable to fetch subordinates for employee ${employeeName}: ${error.message}`);
    }
  }

  async getSalaryDetails(employeeName) {
    try {
      const employee = await this.getEmployeeByNameDetails(employeeName, [
        'designation', 'department', 'employment_type', 'grade'
      ]);
      
      if (!employee) return null;

      // Récupérer les détails du salaire depuis le module Salary Structure
      const SalaryStructureService = require('./SalaryStructureService');
      return await SalaryStructureService.getSalaryByEmployee(employeeName);
    } catch (error) {
      throw new Error(`Unable to fetch salary details for employee ${employeeName}: ${error.message}`);
    }
  }

  async getRecentAttendance(employeeName) {
    try {
      const employee = await this.getEmployeeByNameDetails(employeeName, ['employee']);
      if (!employee) return null;

      // Récupérer les présences des 7 derniers jours
      const AttendanceService = require('./AttendanceService');
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const fromDate = sevenDaysAgo.toISOString().split('T')[0];
      const toDate = new Date().toISOString().split('T')[0];

      return await AttendanceService.getAttendancesByDateRange(fromDate, toDate, {
        employee: employee.employee
      });
    } catch (error) {
      throw new Error(`Unable to fetch recent attendance for employee ${employeeName}: ${error.message}`);
    }
  }

  async getEmployeeLeaveBalance(employeeName) {
    try {
      const employee = await this.getEmployeeByNameDetails(employeeName, ['employee', 'leave_policy']);
      if (!employee) return null;

      // Récupérer le solde de congé depuis le module Leave
      const LeaveService = require('./LeaveService');
      return await LeaveService.getLeaveBalance(employee.employee);
    } catch (error) {
      throw new Error(`Unable to fetch leave balance for employee ${employeeName}: ${error.message}`);
    }
  }

  async getEmployeeProfile(employeeName) {
    try {
      const [employee, leaveBalance, upcomingHolidays, teamMembers] = await Promise.all([
        this.getEmployeeByName(employeeName),
        this.getEmployeeLeaveBalance(employeeName),
        this.getUpcomingHolidays(employeeName),
        this.getTeamMembers(employeeName)
      ]);

      return {
        personal_info: {
          employee_id: employee.employee,
          name: employee.employee_name,
          designation: employee.designation,
          department: employee.department,
          date_of_joining: employee.date_of_joining
        },
        leave_balance: leaveBalance,
        upcoming_holidays: upcomingHolidays,
        team_members: teamMembers
      };
    } catch (error) {
      throw new Error(`Unable to fetch employee profile for ${employeeName}: ${error.message}`);
    }
  }

  async getUpcomingHolidays(employeeName) {
    try {
      const employee = await this.getEmployeeByNameDetails(employeeName, ['holiday_list']);
      if (!employee || !employee.holiday_list) return [];

      // Récupérer les prochains jours fériés
      const HolidayService = require('./HolidayService');
      return await HolidayService.getUpcomingHolidays(employee.holiday_list);
    } catch (error) {
      throw new Error(`Unable to fetch upcoming holidays for employee ${employeeName}: ${error.message}`);
    }
  }

  async getTeamMembers(employeeName) {
    try {
      const subordinates = await this.getSubordinates(employeeName);
      return subordinates || [];
    } catch (error) {
      throw new Error(`Unable to fetch team members for employee ${employeeName}: ${error.message}`);
    }
  }

  async calculateEmployeeTenure(employeeName) {
    try {
      const employee = await this.getEmployeeByName(employeeName, ['date_of_joining', 'date_of_leaving']);
      
      if (!employee || !employee.date_of_joining) {
        return null;
      }

      const joiningDate = new Date(employee.date_of_joining);
      const leavingDate = employee.date_of_leaving ? new Date(employee.date_of_leaving) : new Date();
      
      const tenureInMonths = (leavingDate.getFullYear() - joiningDate.getFullYear()) * 12 + 
                            (leavingDate.getMonth() - joiningDate.getMonth());
      const tenureInYears = tenureInMonths / 12;

      return {
        joining_date: employee.date_of_joining,
        leaving_date: employee.date_of_leaving,
        tenure_months: Math.round(tenureInMonths),
        tenure_years: Math.round(tenureInYears * 10) / 10,
        is_active: !employee.date_of_leaving
      };
    } catch (error) {
      throw new Error(`Unable to calculate tenure for employee ${employeeName}: ${error.message}`);
    }
  }

  async getDepartmentEmployeesSummary(department) {
    try {
      const employees = await this.getEmployeesByDepartment(department);
      
      const summary = {
        department: department,
        total_employees: employees.length,
        active: employees.filter(emp => emp.status === 'Active').length,
        inactive: employees.filter(emp => emp.status === 'Inactive').length,
        left: employees.filter(emp => emp.status === 'Left').length,
        by_designation: {},
        by_gender: {},
        average_tenure: 0
      };

      let totalTenure = 0;
      let activeCount = 0;

      employees.forEach(emp => {
        // Statistiques par designation
        if (emp.designation) {
          summary.by_designation[emp.designation] = (summary.by_designation[emp.designation] || 0) + 1;
        }
        
        // Statistiques par genre
        if (emp.gender) {
          summary.by_gender[emp.gender] = (summary.by_gender[emp.gender] || 0) + 1;
        }
        
        // Calcul de l'ancienneté moyenne
        if (emp.status === 'Active' && emp.date_of_joining) {
          const joiningDate = new Date(emp.date_of_joining);
          const today = new Date();
          const tenure = (today.getFullYear() - joiningDate.getFullYear()) * 12 + 
                        (today.getMonth() - joiningDate.getMonth());
          totalTenure += tenure;
          activeCount++;
        }
      });

      if (activeCount > 0) {
        summary.average_tenure = Math.round(totalTenure / activeCount);
      }

      return summary;
    } catch (error) {
      throw new Error(`Unable to fetch department summary for ${department}: ${error.message}`);
    }
  }

  async getEmployeesBirthdays(month) {
    try {
      const employees = await this.getActiveEmployees(['employee_name', 'date_of_birth', 'department', 'designation']);
      
      return employees.filter(emp => {
        if (!emp.date_of_birth) return false;
        const birthMonth = new Date(emp.date_of_birth).getMonth() + 1;
        return birthMonth === parseInt(month);
      }).map(emp => ({
        employee_name: emp.employee_name,
        date_of_birth: emp.date_of_birth,
        department: emp.department,
        designation: emp.designation,
        birthday_month: month
      }));
    } catch (error) {
      throw new Error(`Unable to fetch employees birthdays for month ${month}: ${error.message}`);
    }
  }

  async getWorkAnniversaries(month) {
    try {
      const employees = await this.getActiveEmployees(['employee_name', 'date_of_joining', 'department', 'designation']);
      
      return employees.filter(emp => {
        if (!emp.date_of_joining) return false;
        const joiningMonth = new Date(emp.date_of_joining).getMonth() + 1;
        return joiningMonth === parseInt(month);
      }).map(emp => ({
        employee_name: emp.employee_name,
        date_of_joining: emp.date_of_joining,
        department: emp.department,
        designation: emp.designation,
        anniversary_month: month
      }));
    } catch (error) {
      throw new Error(`Unable to fetch work anniversaries for month ${month}: ${error.message}`);
    }
  }

  async createEmployeeFromApplicant(applicantData) {
    try {
      const employeeData = {
        first_name: applicantData.first_name,
        last_name: applicantData.last_name,
        employee_name: `${applicantData.first_name} ${applicantData.last_name}`,
        gender: applicantData.gender,
        date_of_birth: applicantData.date_of_birth,
        date_of_joining: new Date().toISOString().split('T')[0],
        department: applicantData.department,
        designation: applicantData.designation,
        employment_type: applicantData.employment_type || 'Full Time',
        status: 'Active',
        personal_email: applicantData.email,
        personal_mobile: applicantData.phone,
        current_address: applicantData.address
      };

      return await this.createEmployeeWithUser(employeeData);
    } catch (error) {
      throw new Error(`Unable to create employee from applicant: ${error.message}`);
    }
  }

  async getEmployeeStats(filters = {}) {
    try {
      const employees = await this.searchEmployees(filters);
      
      const stats = {
        total: employees.length,
        active: employees.filter(emp => emp.status === 'Active').length,
        inactive: employees.filter(emp => emp.status === 'Inactive').length,
        left: employees.filter(emp => emp.status === 'Left').length,
        by_department: {},
        by_designation: {},
        by_employment_type: {},
        by_gender: {},
        by_status: {}
      };

      employees.forEach(emp => {
        // Statistiques par département
        if (emp.department) {
          stats.by_department[emp.department] = (stats.by_department[emp.department] || 0) + 1;
        }
        
        // Statistiques par designation
        if (emp.designation) {
          stats.by_designation[emp.designation] = (stats.by_designation[emp.designation] || 0) + 1;
        }
        
        // Statistiques par type d'emploi
        if (emp.employment_type) {
          stats.by_employment_type[emp.employment_type] = (stats.by_employment_type[emp.employment_type] || 0) + 1;
        }
        
        // Statistiques par genre
        if (emp.gender) {
          stats.by_gender[emp.gender] = (stats.by_gender[emp.gender] || 0) + 1;
        }
        
        // Statistiques par statut
        if (emp.status) {
          stats.by_status[emp.status] = (stats.by_status[emp.status] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      throw new Error(`Unable to fetch employee stats: ${error.message}`);
    }
  }

  async getEmployeesByDateRangeWithStats(fromDate, toDate, extraFilters = {}) {
    try {
      const employees = await this.searchEmployeesBetweenDates(
        fromDate, 
        toDate, 
        'date_of_joining',
        extraFilters
      );

      const stats = await this.getEmployeeStats({
        ...extraFilters,
        date_of_joining: ['between', [fromDate, toDate]]
      });

      return {
        employees,
        stats,
        dateRange: { fromDate, toDate }
      };
    } catch (error) {
      throw new Error(`Unable to fetch employees with stats: ${error.message}`);
    }
  }

  async updateEmployeeContactInfo(name, contactData) {
    try {
      const updateData = {
        personal_email: contactData.personal_email,
        company_email: contactData.company_email,
        personal_mobile: contactData.personal_mobile,
        company_mobile: contactData.company_mobile,
        current_address: contactData.current_address,
        emergency_contact_name: contactData.emergency_contact_name,
        emergency_contact_number: contactData.emergency_contact_number
      };

      return await this.updateEmployee(name, updateData);
    } catch (error) {
      throw new Error(`Unable to update contact information: ${error.message}`);
    }
  }

  async updateEmployeeBankDetails(name, bankData) {
    try {
      const updateData = {
        bank_name: bankData.bank_name,
        bank_account_no: bankData.bank_account_no,
        ifsc_code: bankData.ifsc_code,
        pan_number: bankData.pan_number
      };

      return await this.updateEmployee(name, updateData);
    } catch (error) {
      throw new Error(`Unable to update bank details: ${error.message}`);
    }
  }
}

module.exports = new EmployeeService();