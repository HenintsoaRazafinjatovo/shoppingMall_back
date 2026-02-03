const fs = require("fs");
const csv = require("csv-parser");

class BomImportService {
  async prepareBoms(filePath) {
    return new Promise((resolve, reject) => {
      const boms = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          console.log("Colonnes détectées dans le CSV:", headers);
        })
        .on("data", (row) => {
          try {
            // Champs obligatoires
            const requiredFields = [
              "workstation_name",
              "hour_rate",
              "operating_time",
              "item",
              "bom_qty",
              "bom_uom",
              "operations",
              "raw_materials",
              "company"
            ];

            for (const field of requiredFields) {
              if (!row[field] || row[field].trim() === "") {
                throw new Error(
                  `Ligne ignorée : ${field} vide. Données: ${JSON.stringify(row)}`
                );
              }
            }

            // Découper les opérations (séparées par virgules)
            const operations = row["operations"]
              .split(",")
              .map((op) => op.trim());

            // Découper les matières premières → [{ item_code, qty }]
            const raw_materials = row["raw_materials"]
              .split(",")
              .map((entry) => {
                const [item_code, qty] = entry.split(":");
                return {
                  item_code: item_code.trim(),
                  qty: parseFloat(qty),
                };
              });

            const bom = {
              workstation_name: row["workstation_name"].trim(),
              hour_rate: parseFloat(row["hour_rate"]),
              operating_time: parseFloat(row["operating_time"]),
              item: row["item"].trim(),
              bom_qty: parseFloat(row["bom_qty"]),
              bom_uom: row["bom_uom"].trim(),
              operations,
              raw_materials,
              company: row["company"].trim(),
            };

            console.log("BOM transformé :", bom);
            boms.push(bom);
          } catch (e) {
            console.error("Erreur ligne CSV:", e.message);
          }
        })
        .on("end", () => {
          console.log("Tous les BOMs traités :", boms.length);
          resolve(boms);
        })
        .on("error", (err) => reject(err));
    });
  }
}

module.exports = new BomImportService();
