const fs = require("fs");
const csv = require("csv-parser");

class SalesImportService {
  async prepareSales(filePath) {
    return new Promise((resolve, reject) => {
      const salesOrders = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          console.log("Colonnes détectées dans le CSV:", headers);
        })
        .on("data", (row) => {
          try {
            // CHAMPS OBLIGATOIRES POUR LES VENTES
            const requiredFields = [
              "customer",          // Client
              "items_table",       // Articles et quantités
              "rate",              // Prix unitaire
              "warehouse",         // Entrepôt
              "schedule_date",     // Date prévue
              "paid_amount",       // Montant payé
              "payment_ref",       // Référence de paiement
              "company"            // Société
            ];

            for (const field of requiredFields) {
              if (!row[field] || row[field].trim() === "") {
                throw new Error(`Ligne ignorée : ${field} vide. Données: ${JSON.stringify(row)}`);
              }
            }

            const salesOrder = {
              customer: row["customer"].trim(),
              items_table: row["items_table"].trim(),
              rate: parseFloat(row["rate"]),
              warehouse: row["warehouse"].trim(),
              schedule_date: row["schedule_date"].trim(),
              paid_amount: parseFloat(row["paid_amount"]),
              payment_ref: row["payment_ref"].trim(),
              company: row["company"].trim()
            };

            console.log("Sales Order transformé :", salesOrder);
            salesOrders.push(salesOrder);
          } catch (e) {
            console.error("Erreur ligne CSV:", e.message);
          }
        })
        .on("end", () => {
          console.log("Tous les Sales Orders traités :", salesOrders.length);
          resolve(salesOrders);
        })
        .on("error", (err) => reject(err));
    });
  }
}

module.exports = new SalesImportService();