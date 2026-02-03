const WorkOrderRepository = require('../../repositories/erp/WorkOrderRepository');

const defaultFields = [
  'name', 'production_item', 'item_name', 'bom_no', 'qty', 'status', 
  'planned_start_date', 'planned_end_date', 'company', 'project', 
  'wip_warehouse', 'fg_warehouse', 'scrap_warehouse', 'operations'
];

class WorkOrderService {
  async getAllWorkOrders(fields = defaultFields) {
    return await WorkOrderRepository.getAll({ 
      fields: Array.isArray(fields) ? JSON.stringify(fields) : fields 
    });
  }

  async getWorkOrderByName(name, fields = defaultFields) {
    try {
      const results = await WorkOrderRepository.search({ name: name }, fields);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Unable to fetch work order ${name}: ${error.message}`);
    }
  }

  async getWorkOrderByNameDetails(name, fields = defaultFields) {
    try {
      let params = {};
      
      // Si fields est spécifié, l'utiliser, sinon ne pas inclure de paramètre fields
      if (fields) {
        params.fields = Array.isArray(fields) ? JSON.stringify(fields) : fields;
      }

      const result = await WorkOrderRepository.getOne(name, params);
      return result;
    } catch (error) {
      throw new Error(`Unable to fetch work order ${name}: ${error.message}`);
    }
  }

  async getOpenWorkOrders(fields = defaultFields) {
    return await WorkOrderRepository.getOpenWorkOrders({}, fields);
  }

  async getCompletedWorkOrders(fields = defaultFields) {
    return await WorkOrderRepository.getCompletedWorkOrders({}, fields);
  }

  async getWorkOrdersByItem(item, fields = defaultFields) {
    return await WorkOrderRepository.getWorkOrdersByItem(item, fields);
  }

  async getWorkOrdersByBOM(bomNo, fields = defaultFields) {
    return await WorkOrderRepository.getWorkOrdersByBOM(bomNo, fields);
  }

  async searchWorkOrders(filters, fields = defaultFields) {
    return await WorkOrderRepository.search(filters, fields);
  }

  async searchWorkOrdersBetweenDates(fromDate, toDate, extraFilters = {}, fields = defaultFields) {
    return await WorkOrderRepository.searchBetweenDates('creation', fromDate, toDate, extraFilters, fields);
  }

  async createWorkOrder(data) {
    return await WorkOrderRepository.create(data); 
  }

  async createAndSubmitWorkOrder(data) {
    return await WorkOrderRepository.createAndSubmit(data); 
  }

  async updateWorkOrder(name, data) {
    return await WorkOrderRepository.update(name, data);
  }

  async updateWithCancelAndSubmitWorkOrder(name, data) {
    return await WorkOrderRepository.updateWithCancelAndSubmit(name, data);
  }

  async deleteWorkOrder(name) {
    return await WorkOrderRepository.delete(name);
  }

  // Méthodes spécifiques au statut
  async submitWorkOrder(name) {
    return await WorkOrderRepository.updateStatus(name, 'Submitted');
  }

  async startWorkOrder(name) {
    return await WorkOrderRepository.startWorkOrder(name);
  }

  async completeWorkOrder(name) {
    return await WorkOrderRepository.completeWorkOrder(name);
  }

  async cancelWorkOrder(name) {
    return await WorkOrderRepository.updateStatus(name, 'Cancelled');
  }

  async closeWorkOrder(name) {
    return await WorkOrderRepository.updateStatus(name, 'Closed');
  }

  // Méthodes avancées
  async getWorkOrderWithDetails(name) {
    try {
      const [workOrder, timeline] = await Promise.all([
        this.getWorkOrderByName(name),
        WorkOrderRepository.getWorkOrderTimeline(name)
      ]);

      return {
        ...workOrder,
        timeline
      };
    } catch (error) {
      throw new Error(`Unable to fetch work order details for ${name}: ${error.message}`);
    }
  }

  async getWorkOrderOperations(name) {
    try {
      const workOrder = await WorkOrderRepository.getWorkOrderByNameDetails(name);
      return workOrder ? workOrder.operations : [];
    } catch (error) {
      throw new Error(`Unable to fetch operations for work order ${name}: ${error.message}`);
    }
  }

  async getWorkOrderRequiredItems(name) {
    try {
      const workOrder = await this.getWorkOrderByNameDetails(name, ['required_items']);
      return workOrder ? workOrder.required_items : [];
    } catch (error) {
      throw new Error(`Unable to fetch required items for work order ${name}: ${error.message}`);
    }
  }

  async getWorkOrderProgress(name) {
    try {
      const workOrder = await this.getWorkOrderByName(name, [
        'status', 'qty', 'produced_qty', 'operations'
      ]);

      if (!workOrder) return null;

      const progress = {
        status: workOrder.status,
        totalQty: workOrder.qty,
        producedQty: workOrder.produced_qty || 0,
        completionPercentage: workOrder.qty > 0 ? 
          Math.round(((workOrder.produced_qty || 0) / workOrder.qty) * 100) : 0
      };

      // Calculer la progression des opérations
      if (workOrder.operations && workOrder.operations.length > 0) {
        const completedOperations = workOrder.operations.filter(op => 
          op.status === 'Completed'
        ).length;
        progress.operationsCompleted = completedOperations;
        progress.totalOperations = workOrder.operations.length;
        progress.operationsPercentage = Math.round(
          (completedOperations / workOrder.operations.length) * 100
        );
      }

      return progress;
    } catch (error) {
      throw new Error(`Unable to fetch progress for work order ${name}: ${error.message}`);
    }
  }

  async createWorkOrderFromBOM(bomNo, quantity, plannedDate) {
    try {
      // Récupérer les détails du BOM
      const BOMService = require('./BOMService');
      const bom = await BOMService.getBOMByName(bomNo);
      
      if (!bom) {
        throw new Error(`BOM ${bomNo} not found`);
      }

      const workOrderData = {
        production_item: bom.item,
        item_name: bom.item_name,
        bom_no: bomNo,
        qty: quantity,
        planned_start_date: plannedDate,
        status: 'Draft',
        company: bom.company,
        operations: bom.bom_operations || [],
        required_items: bom.items ? bom.items.map(item => ({
          item_code: item.item_code,
          required_qty: item.qty * quantity,
          rate: item.rate,
          amount: item.amount * quantity
        })) : []
      };

      return await this.createWorkOrder(workOrderData);
    } catch (error) {
      throw new Error(`Unable to create work order from BOM: ${error.message}`);
    }
  }

  async getWorkOrderStats(filters = {}) {
    try {
      const workOrders = await this.searchWorkOrders(filters);
      
      const stats = {
        total: workOrders.length,
        draft: workOrders.filter(wo => wo.status === 'Draft').length,
        submitted: workOrders.filter(wo => wo.status === 'Submitted').length,
        inProcess: workOrders.filter(wo => wo.status === 'In Process').length,
        completed: workOrders.filter(wo => wo.status === 'Completed').length,
        cancelled: workOrders.filter(wo => wo.status === 'Cancelled').length,
        closed: workOrders.filter(wo => wo.status === 'Closed').length,
        totalQuantity: workOrders.reduce((sum, wo) => sum + (wo.qty || 0), 0),
        totalProduced: workOrders.reduce((sum, wo) => sum + (wo.produced_qty || 0), 0)
      };

      stats.completionRate = stats.totalQuantity > 0 ? 
        Math.round((stats.totalProduced / stats.totalQuantity) * 100) : 0;

      return stats;
    } catch (error) {
      throw new Error(`Unable to fetch work order stats: ${error.message}`);
    }
  }

  async getWorkOrdersByDateRangeWithStats(fromDate, toDate, extraFilters = {}) {
    try {
      const workOrders = await this.searchWorkOrdersBetweenDates(
        fromDate, 
        toDate, 
        extraFilters
      );

      const stats = await this.getWorkOrderStats({
        ...extraFilters,
        creation: ['between', [fromDate, toDate]]
      });

      return {
        workOrders,
        stats,
        dateRange: { fromDate, toDate }
      };
    } catch (error) {
      throw new Error(`Unable to fetch work orders with stats: ${error.message}`);
    }
  }
}

module.exports = new WorkOrderService();