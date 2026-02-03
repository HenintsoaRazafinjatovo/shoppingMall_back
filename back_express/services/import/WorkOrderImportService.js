const fs = require("fs");
const csv = require("csv-parser");

class WorkOrderImportService {
  async prepareWorkOrders(filePath) {
    return new Promise((resolve, reject) => {
      const workOrders = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          console.log("Colonnes détectées dans le CSV:", headers);
        })
        .on("data", (row) => {
          try {
            // Champs obligatoires pour un Work Order
            const requiredFields = [
              "production_item",
              "qty_to_manufacture",
              "planned_start_date",
              "company"
            ];

            for (const field of requiredFields) {
              if (!row[field] || row[field].trim() === "") {
                throw new Error(
                  `Ligne ignorée : ${field} vide. Données: ${JSON.stringify(row)}`
                );
              }
            }

            // Transformation des données
            const workOrder = {
              production_item: row["production_item"].trim(),
              qty_to_manufacture: parseFloat(row["qty_to_manufacture"]),
              planned_start_date: row["planned_start_date"].trim(), // format ISO : YYYY-MM-DD
              company: row["company"].trim(),
            };

            console.log("Work Order transformé :", workOrder);
            workOrders.push(workOrder);
          } catch (e) {
            console.error("Erreur ligne CSV:", e.message);
          }
        })
        .on("end", () => {
          console.log("Tous les work orders traités :", workOrders.length);
          resolve(workOrders);
        })
        .on("error", (err) => reject(err));
    });
  }
}

module.exports = new WorkOrderImportService();
