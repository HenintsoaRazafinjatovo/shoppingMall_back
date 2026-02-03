const {
  fetchAll,
  fetchAll2,
  fetchOne,
  create,
  createAndSubmit,
  update,
  cancel,
  submit,
  updateWithCancelAndSubmit,
  deleteWithCancel,
  deleteSafe,
  cancelDeleteCreateAndSubmit,
  cancelDeleteCreateAndSubmitSimple
} = require('../../utils/erp/erpFunction');

class ERPRepository {
  constructor(resource) {
    this.resource = resource;
  }

  // Transforme des objets JS en filtres ERPNext
  static buildFilters(filters) {
    if (!filters) return null;
    if (Array.isArray(filters)) return filters;

    return Object.entries(filters).map(([field, value]) => {
      if (Array.isArray(value)) {
        // Exemple: { qty: ['<', 5] } => ['qty', '<', 5]
        return [field, value[0], value[1]];
      }
      // Exemple: { disabled: 0 } => ['disabled', '=', 0]
      return [field, '=', value];
    });
  }

  async getAll(params = {}) {
    return await fetchAll(this.resource, params);
  }

  async getAll2(params = {}) {
    return await fetchAll2(this.resource, params);
  }

  async getAllWithoutFirst(params = {}) {
    return await fetchAllWithoutFirst(this.resource, params);
  }

  async getOne(name, params = {}) {
    return await fetchOne(this.resource, name, params);
  }

  async create(data) {
    return await create(this.resource, data);
  }

  async createAndSubmit(data) {
    return await createAndSubmit(this.resource, data);
  }

  async update(name, data) {
    return await update(this.resource, name, data);
  }

  async update_v2(name, data) {
    return await cancelDeleteCreateAndSubmit(this.resource, name, data);
  }

  async update_v3(name, data) {
    return await cancelDeleteCreateAndSubmitSimple(this.resource, name, data);
  }

  async updateWithCancelAndSubmit(name, data) {
    return await updateWithCancelAndSubmit(this.resource, name, data);
  }

  async cancel(name) {
    return await cancel(this.resource, name);
  }

  async submit(name) {
    return await submit(this.resource, name);
  }

  async delete(name) {
    return await deleteSafe(this.resource, name);
  }

  async deleteWithCancel(name) {
    return await deleteWithCancel(this.resource, name);
  }

  async search(filters = {}, fields = ['*']) {
    const params = {
      fields: JSON.stringify(fields),
      filters: JSON.stringify(this.constructor.buildFilters(filters))
    };
    return await fetchAll(this.resource, params);
  }

  async searchBetweenDates(field, fromDate, toDate, extraFilters = {}, fields = ['*']) {
    const filters = [
      [field, 'between', [fromDate, toDate]],
      ...this.constructor.buildFilters(extraFilters || {})
    ];

    const params = {
      fields: JSON.stringify(fields),
      filters: JSON.stringify(filters)
    };

    // return await getAll(this.resource, params);
    return await fetchAll(this.resource, params);
  }
}

module.exports = ERPRepository;
