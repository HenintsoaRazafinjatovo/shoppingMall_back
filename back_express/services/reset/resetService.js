const { callERPNextAPI } = require("../erp/erpService"); 

class ResetService {
  async resetDatabase() {
    try {
      console.log("Appel à ERPNext pour réinitialiser la base de données");

      const response = await callERPNextAPI(
        "/api/method/erpnext.api.reset.reset_import_database", 
        "POST",
        {} 
      );

      console.log("Réponse ERPNext:", response);
      return response;
    } catch (err) {
      console.error("Erreur API ERPNext:", err);
      throw new Error("Erreur lors du reset ERPNext: " + err.message);
    }
  }
}

module.exports = new ResetService();
