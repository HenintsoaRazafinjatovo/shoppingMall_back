const ItemImportService = require("../../services/import/ItemImportService");
const PartyImportService = require("../../services/import/PartyImportService");
const PurchaseImportService = require("../../services/import/PurchaseImportService");
const BomImportService = require("../../services/import/BomImportService");
const WorkOrderImportService = require("../../services/import/WorkOrderImportService");
const SalesImportService = require("../../services/import/SalesImportService");
const EmployeeImportService = require("../../services/import/EmployeeImportService");
const SalaryStructureImportService = require("../../services/import/SalaryStructureImportService");
const SalarySlipImportService = require("../../services/import/SalarySlipImportService");
const AttendanceImportService = require("../../services/import/AttendanceImportService");
const SeparationImportService = require("../../services/import/SeparationImportService");
const AssetImportService = require("../../services/import/AssetImportService");
const CSVService = require("../../services/import/CSVService");
const fs = require("fs");
const TimesheetImportService = require("../../services/import/TimesheetImportService");

async function importItemCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const filePath = req.file.path;
    const items = await ItemImportService.prepareItems(filePath);
    console.log("Données préparées:", items);
    const result = await CSVService.sendItemToFrappe(items);
    console.log("Réponse ERPNext:", result);

    // Nettoyage du fichier
    fs.unlinkSync(filePath);
    
    res.json({ 
      success: true, 
      message: "Import réussi", 
      result 
    });
  } catch (err) {
    // Nettoyage en cas d'erreur aussi
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Erreur d'import:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}


async function importCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const filePath = req.file.path;
    const parties = await PartyImportService.prepareParties(filePath);
    console.log("Données préparées:", parties);

    const result = await CSVService.sendToFrappe(parties);
    console.log("Réponse ERPNext:", result);

    // Nettoyage du fichier
    fs.unlinkSync(filePath);
    
    res.json({ 
      success: true, 
      message: "Import réussi", 
      result 
    });
  } catch (err) {
    // Nettoyage en cas d'erreur aussi
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Erreur d'import:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}

async function importPurchaseCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const filePath = req.file.path;

    const purchases = await PurchaseImportService.preparePurchaseOrders(filePath);
    console.log("Données préparées:", purchases);

    const result = await CSVService.sendPurchaseToFrappe(purchases);
    console.log("Réponse ERPNext:", result);

    // Nettoyage du fichier
    fs.unlinkSync(filePath);
    
    res.json({ 
      success: true, 
      message: "Import réussi", 
      result 
    });
  } catch (err) {
    // Nettoyage en cas d'erreur aussi
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Erreur d'import:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}

async function importBomCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const filePath = req.file.path;
    const boms = await BomImportService.prepareBoms(filePath);
    console.log("Données préparées:", boms);

    const result = await CSVService.sendBomToFrappe(boms);
    console.log("Réponse ERPNext:", result);

    // Nettoyage du fichier
    fs.unlinkSync(filePath);
    
    res.json({ 
      success: true, 
      message: "Import réussi", 
      result 
    });
  } catch (err) {
    // Nettoyage en cas d'erreur aussi
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Erreur d'import:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}


async function importWorkOrderCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const filePath = req.file.path;
    const workOrders = await WorkOrderImportService.prepareWorkOrders(filePath);
    console.log("Données préparées:", workOrders);

    const result = await CSVService.sendWorkOrderToFrappe(workOrders);
    console.log("Réponse ERPNext:", result);

    // Nettoyage du fichier
    fs.unlinkSync(filePath);
    
    res.json({ 
      success: true, 
      message: "Import réussi", 
      result 
    });
  } catch (err) {
    // Nettoyage en cas d'erreur aussi
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Erreur d'import:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}

async function importSalesCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const filePath = req.file.path;
    const sales = await SalesImportService.prepareSales(filePath);
    console.log("Données préparées:", sales);

    const result = await CSVService.sendSalesToFrappe(sales);
    console.log("Réponse ERPNext:", result);

    // Nettoyage du fichier
    fs.unlinkSync(filePath);
    
    res.json({ 
      success: true, 
      message: "Import réussi", 
      result 
    });
  } catch (err) {
    // Nettoyage en cas d'erreur aussi
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Erreur d'import:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}


async function importEmployeeCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const filePath = req.file.path;

    const employee = await EmployeeImportService.prepareEmployees(filePath);
    console.log("Données préparées:", employee);
    const result = await CSVService.sendEmployeeToFrappe(employee);
    console.log("Réponse ERPNext:", result);

    fs.unlinkSync(filePath);
    
    res.json({ 
      success: true, 
      message: "Import réussi", 
      result 
    });
  } catch (err) {
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Erreur d'import:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}

async function importSalaryStructureCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const filePath = req.file.path;

    const salaryStructures = await SalaryStructureImportService.prepareStructures(filePath);
    console.log("Données préparées:", salaryStructures);
    const result = await CSVService.sendSalaryStructureToFrappe(salaryStructures);
    console.log("Réponse ERPNext:", result);

    fs.unlinkSync(filePath);
    
    res.json({ 
      success: true, 
      message: "Import réussi", 
      result 
    });
  } catch (err) {
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Erreur d'import:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}

async function importSalarySlipCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const filePath = req.file.path;

    const salarySlips = await SalarySlipImportService.prepareSalaries(filePath);
    console.log("Données préparées:", salarySlips);
    const result = await CSVService.sendSalarySlipToFrappe(salarySlips);
    console.log("Réponse ERPNext:", result);

    fs.unlinkSync(filePath);
    
    res.json({ 
      success: true, 
      message: "Import réussi", 
      result 
    });
  } catch (err) {
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Erreur d'import:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}


async function importAttendanceCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const filePath = req.file.path;

    const attendances = await AttendanceImportService.prepareAttendances(filePath);
    console.log("Données préparées:", attendances);
    const result = await CSVService.sendAttendanceToFrappe(attendances);
    console.log("Réponse ERPNext:", result);

    fs.unlinkSync(filePath);
    
    res.json({ 
      success: true, 
      message: "Import réussi", 
      result 
    });
  } catch (err) {
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Erreur d'import:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}


async function importSeparationCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const filePath = req.file.path;

    const separations = await SeparationImportService.prepareSeparations(filePath);
    console.log("Données préparées:", separations);
    const result = await CSVService.sendSeparationToFrappe(separations);
    console.log("Réponse ERPNext:", result);

    fs.unlinkSync(filePath);
    
    res.json({ 
      success: true, 
      message: "Import réussi", 
      result 
    });
  } catch (err) {
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Erreur d'import:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}


async function importTimesheetCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const filePath = req.file.path;

    const timesheets = await TimesheetImportService.prepareTimesheets(filePath);
    console.log("Données préparées:", timesheets);
    const result = await CSVService.sendTimesheetToFrappe(timesheets);
    console.log("Réponse ERPNext:", result);

    fs.unlinkSync(filePath);
    
    res.json({ 
      success: true, 
      message: "Import réussi", 
      result 
    });
  } catch (err) {
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Erreur d'import:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}

async function importAssetCSV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const filePath = req.file.path;

    const asset = await AssetImportService.prepareAssets(filePath);
    console.log("Données préparées:", asset);
    const result = await CSVService.sendAssetToFrappe(asset);
    console.log("Réponse ERPNext:", result);

    fs.unlinkSync(filePath);
    
    res.json({ 
      success: true, 
      message: "Import réussi", 
      result 
    });
  } catch (err) {
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Erreur d'import:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}

module.exports = { importItemCSV, importCSV, importPurchaseCSV, importBomCSV, importWorkOrderCSV, importSalesCSV, importEmployeeCSV, importSalaryStructureCSV, importSalarySlipCSV, importAttendanceCSV, importSeparationCSV, importTimesheetCSV, importAssetCSV };