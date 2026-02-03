const fs = require("fs");
const csv = require("csv-parser");

class PurchaseImportService {
  async preparePurchaseOrders(filePath) {
    return new Promise((resolve, reject) => {
      const purchaseOrders = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          console.log("Colonnes détectées dans le CSV:", headers);
        })
        .on("data", (row) => {
          try {
            // CHAMPS OBLIGATOIRES CORRIGÉS
            const requiredFields = [
              "supplier",          // ← Garder
              "items_table",       // ← Garder  
              "rate",              // ← Garder
              "warehouse",         // ← Garder
              "schedule_date",     // ← Garder
              "paid_amount",       // ← Garder
              "payment_ref",       // ← Garder (référence métier)
              "company"            // ← Garder
            ];

            // SUPPRIMER ces champs obligatoires :
            // "po_id",           // ← À supprimer (géré auto par ERPNext)
            // "receipt_id",      // ← À supprimer (géré auto par ERPNext)

            for (const field of requiredFields) {
              if (!row[field] || row[field].trim() === "") {
                throw new Error(`Ligne ignorée : ${field} vide. Données: ${JSON.stringify(row)}`);
              }
            }

            const purchaseOrder = {
              supplier: row["supplier"].trim(),
              items_table: row["items_table"].trim(),
              rate: parseFloat(row["rate"]),
              warehouse: row["warehouse"].trim(),
              schedule_date: row["schedule_date"].trim(),
              paid_amount: parseFloat(row["paid_amount"]),
              payment_ref: row["payment_ref"].trim(),
              company: row["company"].trim()
            };

            console.log("Purchase Order transformé :", purchaseOrder);
            purchaseOrders.push(purchaseOrder);
          } catch (e) {
            console.error("Erreur ligne CSV:", e.message);
          }
        })
        .on("end", () => {
          console.log("Tous les Purchase Orders traités :", purchaseOrders.length);
          resolve(purchaseOrders);
        })
        .on("error", (err) => reject(err));
    });
  }
}

module.exports = new PurchaseImportService();