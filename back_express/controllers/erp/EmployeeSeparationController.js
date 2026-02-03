const EmployeeSeparationService = require('../../services/erp/EmployeeSeparationService');

class EmployeeSeparationController {
  async getAll(req, res) {
    try {
      const { fields, status } = req.query;
      let separations;
      
      if (status === 'pending') {
        separations = await EmployeeSeparationService.getPendingSeparations(fields);
      } else if (status === 'approved') {
        separations = await EmployeeSeparationService.getApprovedSeparations(fields);
      } else if (status === 'rejected') {
        separations = await EmployeeSeparationService.getRejectedSeparations(fields);
      } else {
        separations = await EmployeeSeparationService.getAllSeparations(fields);
      }
      
      res.json(separations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getOne(req, res) {
    try {
      const { fields, details } = req.query;
      let separation;

      if (details === 'true') {
        separation = await EmployeeSeparationService.getSeparationWithDetails(req.params.name);
      } else {
        separation = await EmployeeSeparationService.getSeparationByName(req.params.name, fields);
      }

      if (!separation) {
        return res.status(404).json({ error: 'Separation record not found' });
      }
      res.json(separation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByEmployee(req, res) {
    try {
      const { fields } = req.query;
      const { employee } = req.params;
      const separations = await EmployeeSeparationService.getSeparationsByEmployee(employee, fields);
      res.json(separations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getByDepartment(req, res) {
    try {
      const { fields } = req.query;
      const { department } = req.params;
      const separations = await EmployeeSeparationService.getSeparationsByDepartment(department, fields);
      res.json(separations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getTimeline(req, res) {
    try {
      const { name } = req.params;
      const timeline = await EmployeeSeparationService.getSeparationTimeline(name);
      
      if (!timeline) {
        return res.status(404).json({ error: 'Separation record not found' });
      }
      res.json(timeline);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getClearance(req, res) {
    try {
      const { name } = req.params;
      const clearance = await EmployeeSeparationService.getSeparationClearance(name);
      res.json(clearance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getNoticePeriod(req, res) {
    try {
      const { name } = req.params;
      const noticePeriod = await EmployeeSeparationService.calculateNoticePeriod(name);
      
      if (!noticePeriod) {
        return res.status(404).json({ error: 'Separation record not found or missing dates' });
      }
      res.json(noticePeriod);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getStats(req, res) {
    try {
      const { filters } = req.body;
      const stats = await EmployeeSeparationService.getSeparationStats(filters);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async search(req, res) {
    try {
      const { filters, fields } = req.body;
      const separations = await EmployeeSeparationService.searchSeparations(filters, fields);
      res.json(separations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchBetweenDates(req, res) {
    try {
      const { fromDate, toDate, extraFilters, fields } = req.body;
      const separations = await EmployeeSeparationService.searchSeparationsBetweenDates(
        fromDate, 
        toDate, 
        extraFilters, 
        fields
      );
      res.json(separations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async searchWithStats(req, res) {
    try {
      const { fromDate, toDate, extraFilters } = req.body;
      const result = await EmployeeSeparationService.getSeparationsByDateRangeWithStats(
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
      const separation = await EmployeeSeparationService.createSeparation(req.body);
      res.json(separation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createFromResignation(req, res) {
    try {
      const { employee, resignationData } = req.body;
      const separation = await EmployeeSeparationService.createSeparationFromResignation(
        employee, 
        resignationData
      );
      res.json(separation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const separation = await EmployeeSeparationService.updateSeparation(req.params.name, req.body);
      res.json(separation);
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
          result = await EmployeeSeparationService.submitSeparation(name);
          break;
        case 'Approved':
          result = await EmployeeSeparationService.approveSeparation(name);
          break;
        case 'Rejected':
          result = await EmployeeSeparationService.rejectSeparation(name);
          break;
        case 'Cancelled':
          result = await EmployeeSeparationService.cancelSeparation(name);
          break;
        default:
          return res.status(400).json({ error: 'Invalid status' });
      }
      
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async initiateExitProcess(req, res) {
    try {
      const { name } = req.params;
      const result = await EmployeeSeparationService.initiateExitProcess(name);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      await EmployeeSeparationService.deleteSeparation(req.params.name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new EmployeeSeparationController();