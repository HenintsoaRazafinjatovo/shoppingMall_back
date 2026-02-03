// const { callERPNextAPI } = require("../erp/erpService");

// class CSVService {
//   async sendToFrappe(employees) {
//     const payload = {
//       Employees: employees,
//       // SalaryComp_Struct: salaryCompStruct,
//       // SalaryAssign_slip: salaryAssign,
//     };

//     console.log("Payload envoyé à ERPNext:", JSON.stringify(payload, null, 2));

//     try {
//       // IMPORTANT: Ne pas stringifier le payload, callERPNextAPI le fera
//       const response = await callERPNextAPI(
//         "/api/method/importHr2", 
//         "POST", 
//         payload
//       );
      
//       console.log("Réponse reçue de ERPNext:", response);
//       return response;
//     } catch (err) {
//       console.error("Erreur API ERPNext:", err);
//       throw new Error("Erreur lors de l'importation vers Frappe: " + err.message);
//     }
//   }
// }

// module.exports = new CSVService();

const { callERPNextAPI } = require("../erp/erpService");

class CSVService {
  async sendToFrappe(items) {
    try {
      console.log("Envoi à ERPNext - Données:", items);
      const response = await callERPNextAPI(
        // "/api/method/erpnext.api.importCSV.import_test_workorder",
        "/api/method/erpnext.api.importCSV.import_test",
        "POST", 
        { parties: items }  
      );
      
      console.log("Réponse ERPNext:", response);
      return response;
    } catch (err) {
      console.error("Erreur API ERPNext:", err);
      throw new Error("Erreur lors de l'importation: " + err.message);
    }
  }

  async sendItemToFrappe(items) {
    try {
      console.log("Envoi à ERPNext - Données:", items);
      const response = await callERPNextAPI(
        "/api/method/erpnext.api.importCSV.import_test_item",
        "POST", 
        { items: items }  
      );
      
      console.log("Réponse ERPNext:", response);
      return response;
    } catch (err) {
      console.error("Erreur API ERPNext:", err);
      throw new Error("Erreur lors de l'importation: " + err.message);
    }
  }


  async sendPurchaseToFrappe(items) {
    try {
      console.log("Envoi à ERPNext - Données:", items);
      const response = await callERPNextAPI(
        "/api/method/erpnext.api.importCSV.import_test_purchase",
        "POST", 
        { purchases: items }  
      );
      
      console.log("Réponse ERPNext:", response);
      return response;
    } catch (err) {
      console.error("Erreur API ERPNext:", err);
      throw new Error("Erreur lors de l'importation: " + err.message);
    }
  }


  async sendBomToFrappe(items) {
    try {
      console.log("Envoi à ERPNext - Données:", items);
      const response = await callERPNextAPI(
        "/api/method/erpnext.api.importCSV.import_test_bom",
        "POST", 
        { workstations: items }  
      );
      
      console.log("Réponse ERPNext:", response);
      return response;
    } catch (err) {
      console.error("Erreur API ERPNext:", err);
      throw new Error("Erreur lors de l'importation: " + err.message);
    }
  }


  async sendWorkOrderToFrappe(items) {
    try {
      console.log("Envoi à ERPNext - Données:", items);
      const response = await callERPNextAPI(
        "/api/method/erpnext.api.importCSV.import_test_workorder",
        "POST", 
        { workorders: items }  
      );
      
      console.log("Réponse ERPNext:", response);
      return response;
    } catch (err) {
      console.error("Erreur API ERPNext:", err);
      throw new Error("Erreur lors de l'importation: " + err.message);
    }
  }

  async sendSalesToFrappe(items) {
    try {
      console.log("Envoi à ERPNext - Données:", items);
      const response = await callERPNextAPI(
        "/api/method/erpnext.api.importCSV.import_test_sales",
        "POST", 
        { sales: items }  
      );
      
      console.log("Réponse ERPNext:", response);
      return response;
    } catch (err) {
      console.error("Erreur API ERPNext:", err);
      throw new Error("Erreur lors de l'importation: " + err.message);
    }
  }

  async sendEmployeeToFrappe(items) {
      try {
        console.log("Envoi à ERPNext - Données:", items);
        const response = await callERPNextAPI(
          "/api/method/erpnext.api.importCSV.import_test_employee",
          "POST", 
          { employees: items }  
        );
        
        console.log("Réponse ERPNext:", response);
        return response;
      } catch (err) {
        console.error("Erreur API ERPNext:", err);
        throw new Error("Erreur lors de l'importation: " + err.message);
      }
    }

  async sendSalaryComponentToFrappe(items) {
    try {
      console.log("Envoi à ERPNext - Données:", items);
      const response = await callERPNextAPI(
        "/api/method/erpnext.api.importCSV.import_test_salary_component",
        "POST", 
        { salary_components: items }  
      );
      
      console.log("Réponse ERPNext:", response);
      return response;
    } catch (err) {
      console.error("Erreur API ERPNext:", err);
      throw new Error("Erreur lors de l'importation: " + err.message);
    }
  }

  async sendSalaryStructureToFrappe(items) {
    try {
      console.log("Envoi à ERPNext - Données:", items);
      const response = await callERPNextAPI(
        "/api/method/erpnext.api.importCSV.import_test_salary_structure",
        "POST", 
        { structures: items }  
      );
      
      console.log("Réponse ERPNext:", response);
      return response;
    } catch (err) {
      console.error("Erreur API ERPNext:", err);
      throw new Error("Erreur lors de l'importation: " + err.message);
    }
  }


  async sendSalarySlipToFrappe(items) {
    try {
      console.log("Envoi à ERPNext - Données:", items);
      const response = await callERPNextAPI(
        "/api/method/erpnext.api.importCSV.import_test_salary_slip",
        "POST", 
        { slips: items }  
      );
      
      console.log("Réponse ERPNext:", response);
      return response;
    } catch (err) {
      console.error("Erreur API ERPNext:", err);
      throw new Error("Erreur lors de l'importation: " + err.message);
    }
  }


  async sendAttendanceToFrappe(items) {
    try {
      console.log("Envoi à ERPNext - Données:", items);
      const response = await callERPNextAPI(
        "/api/method/erpnext.api.importCSV.import_test_attendance",
        "POST", 
        { attendances: items }  
      );
      
      console.log("Réponse ERPNext:", response);
      return response;
    } catch (err) {
      console.error("Erreur API ERPNext:", err);
      throw new Error("Erreur lors de l'importation: " + err.message);
    }
  }

  async sendTimesheetToFrappe(items) {
    try {
      console.log("Envoi à ERPNext - Données:", items);
      const response = await callERPNextAPI(
        "/api/method/erpnext.api.importCSV.import_test_timesheet",
        "POST", 
        { timesheets: items }  
      );
      
      console.log("Réponse ERPNext:", response);
      return response;
    } catch (err) {
      console.error("Erreur API ERPNext:", err);
      throw new Error("Erreur lors de l'importation: " + err.message);
    }
  }


  async sendSeparationToFrappe(items) {
    try {
      console.log("Envoi à ERPNext - Données:", items);
      const response = await callERPNextAPI(
        "/api/method/erpnext.api.importCSV.import_test_separation",
        "POST", 
        { separations: items }  
      );
      
      console.log("Réponse ERPNext:", response);
      return response;
    } catch (err) {
      console.error("Erreur API ERPNext:", err);
      throw new Error("Erreur lors de l'importation: " + err.message);
    }
  }

  async sendAssetToFrappe(items) {
    try {
      console.log("Envoi à ERPNext - Données:", items);
      const response = await callERPNextAPI(
        "/api/method/erpnext.api.importCSV.import_test_asset",
        "POST", 
        { assets: items }  
      );
      
      console.log("Réponse ERPNext:", response);
      return response;
    } catch (err) {
      console.error("Erreur API ERPNext:", err);
      throw new Error("Erreur lors de l'importation: " + err.message);
    }
  }


}

module.exports = new CSVService();