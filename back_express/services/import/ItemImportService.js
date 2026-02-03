const fs = require("fs");
const csv = require("csv-parser");

class ItemImportService {
  async prepareItems(filePath) {
    return new Promise((resolve, reject) => {
      const items = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          console.log("Colonnes détectées dans le CSV:", headers);
        })
        .on("data", (row) => {
          try {
            // Champs obligatoires
            const requiredFields = [
              "item_code",
              "item_name",
              "stock_uom",
              "is_stock_item",
              "warehouse_name",
              "warehouse_type",
              "company",
              "item_group"
            ];

            for (const field of requiredFields) {
              if (!row[field] || row[field].trim() === "") {
                throw new Error(`Ligne ignorée : ${field} vide. Données: ${JSON.stringify(row)}`);
              }
            }

            const item = {
              item_code: row["item_code"].trim(),
              item_name: row["item_name"].trim(),
              stock_uom: row["stock_uom"].trim(),
              is_stock_item: row["is_stock_item"].trim(),
              default_warehouse: row["default_warehouse"] ? row["default_warehouse"].trim() : "",
              warehouse_name: row["warehouse_name"].trim(),
              warehouse_type: row["warehouse_type"].trim(),
              company: row["company"].trim(),
              item_group: row["item_group"].trim() // AJOUTÉ
            };

            console.log("Item transformé :", item);
            items.push(item);
          } catch (e) {
            console.error("Erreur ligne CSV:", e.message);
          }
        })
        .on("end", () => {
          console.log("Tous les items traités :", items.length);
          resolve(items);
        })
        .on("error", (err) => reject(err));
    });
  }
}

module.exports = new ItemImportService();
