const SalaryComponentRepository = require('../../repositories/erp/SalaryComponentRepository');

const defaultFields = [
  'name',
  'salary_component',
  'type',
  'category',
  'description',
  'is_tax_applicable',
  'is_flexible_benefit',
  'variable_based_on_taxable_salary',
  'amount',
  'amount_based_on_formula',
  'formula',
  'condition',
  'depends_on_payment_days',
  'deduct_full_tax_on_selected_payroll_date',
  'do_not_include_in_total',
  'only_tax_impact',
  'create_separate_payment_entry_against_benefit_claim',
  'statistical_component',
  'is_income_tax_component',
  'exempted_from_income_tax',
  'round_to_the_nearest_integer',
  'company',
  'frequency',
  'is_active',
  'accounts',
  'creation',
  'modified'
];

class SalaryComponentService {
  async getAllSalaryComponents(fields = defaultFields) {
    return await SalaryComponentRepository.getAll({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
  }

  async getSalaryComponentByName(name, fields = defaultFields) {
    try {
      const results = await SalaryComponentRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch Salary Component ${name}: ${error.message}`);
    }
  }

  async getSalaryComponentByNameDetails(name, fields = defaultFields) {
    try {
      let params = {};
      
      if (fields) {
        params.fields = Array.isArray(fields) ? JSON.stringify(fields) : fields;
      }

      const result = await SalaryComponentRepository.getOne(name, params);
      return result;
    } catch (error) {
      throw new Error(`Unable to fetch Salary Component ${name}: ${error.message}`);
    }
  }

  async searchSalaryComponents(filters, fields = defaultFields) {
    return await SalaryComponentRepository.search(filters, fields);
  }

  async searchSalaryComponentsBetweenDates(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await SalaryComponentRepository.searchBetweenDates('creation', fromDate, toDate, extraFilters, fields);
  }

  async searchSalaryComponentsByCreationDate(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await SalaryComponentRepository.searchBetweenDates('creation', fromDate, toDate, extraFilters, fields);
  }

  async createSalaryComponent(data) {
    return await SalaryComponentRepository.create(data); 
  }

  async createAndSubmitSalaryComponent(data) {
    return await SalaryComponentRepository.createAndSubmit(data); 
  }

  async updateWithCancelAndSubmitSalaryComponent(name, data) {
    return await SalaryComponentRepository.updateWithCancelAndSubmit(name, data);
  }

  async updateSalaryComponent(name, data) {
    return await SalaryComponentRepository.update(name, data);
  }

  async deleteSalaryComponent(name) {
    return await SalaryComponentRepository.delete(name);
  }

  // Méthodes spécifiques aux Salary Components
  async getSalaryComponentsByType(type, fields = defaultFields) {
    return await SalaryComponentRepository.search({ type: type }, fields);
  }

  async getSalaryComponentsByCategory(category, fields = defaultFields) {
    return await SalaryComponentRepository.search({ category: category }, fields);
  }

  async getSalaryComponentsByActiveStatus(isActive, fields = defaultFields) {
    return await SalaryComponentRepository.search({ is_active: isActive ? 1 : 0 }, fields);
  }

  async getSalaryComponentsByCompany(company, fields = defaultFields) {
    return await SalaryComponentRepository.search({ company: company }, fields);
  }

  async getSalaryComponentsByFrequency(frequency, fields = defaultFields) {
    return await SalaryComponentRepository.search({ frequency: frequency }, fields);
  }

  async getEarningComponents(fields = defaultFields) {
    return await this.getSalaryComponentsByType('Earning', fields);
  }

  async getDeductionComponents(fields = defaultFields) {
    return await this.getSalaryComponentsByType('Deduction', fields);
  }

  async getTaxComponents(fields = defaultFields) {
    return await this.searchSalaryComponents({ 
      is_income_tax_component: 1 
    }, fields);
  }

  async getFlexibleBenefitComponents(fields = defaultFields) {
    return await this.searchSalaryComponents({ 
      is_flexible_benefit: 1 
    }, fields);
  }

  // Méthodes de calcul et d'analyse
  async calculateComponentAmount(componentName, context = {}) {
    try {
      const component = await this.getSalaryComponentByNameDetails(componentName, [
        'amount', 'formula', 'amount_based_on_formula', 'type', 'condition'
      ]);

      if (!component) {
        throw new Error('Salary Component not found');
      }

      let calculatedAmount = 0;

      if (component.amount_based_on_formula && component.formula) {
        // Implémenter l'évaluation de formule basique
        calculatedAmount = this.evaluateFormula(component.formula, context);
      } else {
        calculatedAmount = component.amount || 0;
      }

      // Appliquer les conditions si présentes
      if (component.condition && !this.evaluateCondition(component.condition, context)) {
        calculatedAmount = 0;
      }

      return {
        component: componentName,
        amount: calculatedAmount,
        type: component.type,
        is_calculated: component.amount_based_on_formula,
        condition_applied: component.condition ? true : false
      };
    } catch (error) {
      throw new Error(`Unable to calculate amount for component ${componentName}: ${error.message}`);
    }
  }

  evaluateFormula(formula, context) {
    // Implémentation basique d'évaluation de formule
    // Cette fonction devrait être étendue selon les besoins spécifiques
    try {
      let evaluatedFormula = formula;
      
      // Remplacer les variables du contexte
      Object.keys(context).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        evaluatedFormula = evaluatedFormula.replace(regex, context[key]);
      });

      // Évaluation sécurisée de la formule
      // Note: En production, utilisez une bibliothèque d'évaluation d'expressions mathématiques sécurisée
      return eval(evaluatedFormula);
    } catch (error) {
      throw new Error(`Formula evaluation error: ${error.message}`);
    }
  }

  evaluateCondition(condition, context) {
    // Implémentation basique d'évaluation de condition
    try {
      let evaluatedCondition = condition;
      
      // Remplacer les variables du contexte
      Object.keys(context).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        evaluatedCondition = evaluatedCondition.replace(regex, context[key]);
      });

      return eval(evaluatedCondition);
    } catch (error) {
      throw new Error(`Condition evaluation error: ${error.message}`);
    }
  }

  async getComponentUsage(componentName) {
    try {
      // Cette méthode nécessiterait des appels supplémentaires pour vérifier l'utilisation
      // dans les structures de salaire, les bulletins, etc.
      const usage = {
        salary_structures: [],
        salary_slips: [],
        total_usage_count: 0
      };

      // Implémentation simplifiée - à adapter selon votre structure de données
      const structures = await SalaryComponentRepository.searchRelated('Salary Structure', componentName);
      usage.salary_structures = structures;
      usage.total_usage_count = structures.length;

      return usage;
    } catch (error) {
      throw new Error(`Unable to fetch usage for component ${componentName}: ${error.message}`);
    }
  }

  async getStructuresUsingComponent(componentName) {
    try {
      // Rechercher les structures de salaire utilisant ce composant
      const structures = await SalaryComponentRepository.searchRelated('Salary Structure', componentName);
      return structures;
    } catch (error) {
      throw new Error(`Unable to fetch structures using component ${componentName}: ${error.message}`);
    }
  }

  async bulkCreateSalaryComponents(componentsData) {
    try {
      const creationResults = [];
      
      for (const componentData of componentsData) {
        try {
          const newComponent = await this.createSalaryComponent(componentData);
          creationResults.push({
            component: componentData.salary_component,
            success: true,
            name: newComponent.name
          });
        } catch (error) {
          creationResults.push({
            component: componentData.salary_component,
            success: false,
            error: error.message
          });
        }
      }

      return creationResults;
    } catch (error) {
      throw new Error(`Unable to create salary components in bulk: ${error.message}`);
    }
  }

  async validateSalaryComponent(componentData) {
    const errors = [];

    // Validation de base
    if (!componentData.salary_component) {
      errors.push('Salary component name is required');
    }

    if (!componentData.type) {
      errors.push('Component type is required');
    }

    if (!['Earning', 'Deduction'].includes(componentData.type)) {
      errors.push('Component type must be either "Earning" or "Deduction"');
    }

    // Validation de la formule
    if (componentData.amount_based_on_formula && !componentData.formula) {
      errors.push('Formula is required when amount is based on formula');
    }

    // Validation des montants
    if (!componentData.amount_based_on_formula && (!componentData.amount && componentData.amount !== 0)) {
      errors.push('Amount is required when not using formula');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  async getComponentsSummary() {
    try {
      const allComponents = await this.getAllSalaryComponents();
      
      const summary = {
        total_components: allComponents.length,
        earning_components: allComponents.filter(c => c.type === 'Earning').length,
        deduction_components: allComponents.filter(c => c.type === 'Deduction').length,
        active_components: allComponents.filter(c => c.is_active).length,
        tax_applicable_components: allComponents.filter(c => c.is_tax_applicable).length,
        flexible_benefit_components: allComponents.filter(c => c.is_flexible_benefit).length,
        formula_based_components: allComponents.filter(c => c.amount_based_on_formula).length,
        by_frequency: {},
        by_category: {}
      };

      // Compter par fréquence
      allComponents.forEach(component => {
        const frequency = component.frequency || 'Monthly';
        summary.by_frequency[frequency] = (summary.by_frequency[frequency] || 0) + 1;
      });

      // Compter par catégorie
      allComponents.forEach(component => {
        const category = component.category || 'Uncategorized';
        summary.by_category[category] = (summary.by_category[category] || 0) + 1;
      });

      return summary;
    } catch (error) {
      throw new Error(`Unable to generate components summary: ${error.message}`);
    }
  }

}

module.exports = new SalaryComponentService();