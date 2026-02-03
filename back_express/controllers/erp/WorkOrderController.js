const WorkOrderService = require('../../services/erp/WorkOrderService');

class WorkOrderController {
  async getAll(req, res) {
    try {
      const { fields, status } = req.query;
      let workOrders;
      
      if (status === 'open') {
        workOrders = await WorkOrderService.getOpenWorkOrders(fields);
      } else if (status === 'completed') {
        workOrders = await WorkOrderService.getCompletedWorkOrders(fields);
      } else {
        workOrders = await WorkOrderService.getAllWorkOrders(fields);
      }
      
      res.json(workOrders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const { fields, details } = req.query;
      let workOrder;

      if (details === 'true') {
        workOrder = await WorkOrderService.getWorkOrderWithDetails(req.params.name);
      } else {
        workOrder = await WorkOrderService.getWorkOrderByName(req.params.name, fields);
      }

      if (!workOrder) {
        return res.status(404).json({ error: 'Work order not found' });
      }
      res.json(workOrder);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByItem(req, res) {
    try {
      const { fields } = req.query;
      const { item } = req.params;
      const workOrders = await WorkOrderService.getWorkOrdersByItem(item, fields);
      res.json(workOrders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByBOM(req, res) {
    try {
      const { fields } = req.query;
      const { bomNo } = req.params;
      const workOrders = await WorkOrderService.getWorkOrdersByBOM(bomNo, fields);
      res.json(workOrders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOperations(req, res) {
    try {
      const { name } = req.params;
      const operations = await WorkOrderService.getWorkOrderOperations(name);
      res.json(operations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getRequiredItems(req, res) {
    try {
      const { name } = req.params;
      const items = await WorkOrderService.getWorkOrderRequiredItems(name);
      res.json(items);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getProgress(req, res) {
    try {
      const { name } = req.params;
      const progress = await WorkOrderService.getWorkOrderProgress(name);
      
      if (!progress) {
        return res.status(404).json({ error: 'Work order not found' });
      }
      res.json(progress);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getStats(req, res) {
    try {
      const { filters } = req.body;
      const stats = await WorkOrderService.getWorkOrderStats(filters);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const workOrders = await WorkOrderService.searchWorkOrders(filters, fields);
      res.json(workOrders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const workOrders = await WorkOrderService.searchWorkOrdersBetweenDates(
        fromDate, 
        toDate, 
        extraFilters, 
        fields
      );
      res.json(workOrders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchWithStats(req, res) {
    try {
      const { fromDate, toDate, extraFilters } = req.body;
      const result = await WorkOrderService.getWorkOrdersByDateRangeWithStats(
        fromDate, 
        toDate, 
        extraFilters
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const workOrder = await WorkOrderService.createWorkOrder(req.body);
      res.json(workOrder);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createFromBOM(req, res) {
    try {
      const { bomNo, quantity, plannedDate } = req.body;
      const workOrder = await WorkOrderService.createWorkOrderFromBOM(
        bomNo, 
        quantity, 
        plannedDate
      );
      res.json(workOrder);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const workOrder = await WorkOrderService.updateWorkOrder(req.params.name, req.body);
      res.json(workOrder);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { name } = req.params;
      const { status } = req.body;
      
      let result;
      switch (status) {
        case 'Submitted':
          result = await WorkOrderService.submitWorkOrder(name);
          break;
        case 'In Process':
          result = await WorkOrderService.startWorkOrder(name);
          break;
        case 'Completed':
          result = await WorkOrderService.completeWorkOrder(name);
          break;
        case 'Cancelled':
          result = await WorkOrderService.cancelWorkOrder(name);
          break;
        case 'Closed':
          result = await WorkOrderService.closeWorkOrder(name);
          break;
        default:
          return res.status(400).json({ error: 'Invalid status' });
      }
      
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await WorkOrderService.deleteWorkOrder(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new WorkOrderController();