const ERPRepository = require('./ERPRepository');

const doctype = 'Work Order'
class WorkOrderRepository extends ERPRepository {
    constructor() {
        super(doctype); 
    }
// Méthodes spécifiques à Work Order
  async getOpenWorkOrders(filters = {}, fields = []) {
    return await this.search({ 
      ...filters, 
      status: ['in', ['Draft', 'Submitted', 'In Process']] 
    }, fields);
  }

  async getCompletedWorkOrders(filters = {}, fields = []) {
    return await this.search({ 
      ...filters, 
      status: 'Completed' 
    }, fields);
  }

  async getWorkOrdersByItem(item, fields = []) {
    return await this.search({ production_item: item }, fields);
  }

  async getWorkOrdersByBOM(bomNo, fields = []) {
    return await this.search({ bom_no: bomNo }, fields);
  }

  async updateStatus(name, status) {
    return await this.update(name, { status: status });
  }

  async startWorkOrder(name) {
    return await this.update(name, { 
      status: 'In Process',
      started_at: new Date().toISOString()
    });
  }

  async completeWorkOrder(name) {
    return await this.update(name, { 
      status: 'Completed',
      completed_at: new Date().toISOString()
    });
  }

  async getWorkOrderWithOperations(name, fields = ['name', 'operations', 'production_item', 'qty']) {
    const workOrder = await this.getOne(name, { 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
    return workOrder;
  }

  async getWorkOrderTimeline(name) {
    const workOrder = await this.getOne(name, {
      fields: JSON.stringify(['creation', 'planned_start_date', 'planned_end_date', 'started_at', 'completed_at', 'status'])
    });
    return workOrder;
  }
}

module.exports = new WorkOrderRepository();
