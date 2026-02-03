const fs = require("fs");
const csv = require("csv-parser");

class SeparationImportService {
  async prepareSeparations(filePath) {
    return new Promise((resolve, reject) => {
      const separations = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          console.log("Colonnes détectées dans le CSV:", headers);
        })
        .on("data", (row) => {
          try {
            // Champs obligatoires
            const requiredFields = ["employee", "separation_date", "reason", "company"];

            for (const field of requiredFields) {
              if (!row[field] || row[field].trim() === "") {
                throw new Error(
                  `Ligne ignorée : ${field} vide. Données: ${JSON.stringify(row)}`
                );
              }
            }

            const separation = {
              employee: row["employee"].trim(),
              separation_date: row["separation_date"].trim(),
              reason: row["reason"].trim(),
              company: row["company"].trim(),
            };

            console.log("Separation transformée :", separation);
            separations.push(separation);
          } catch (e) {
            console.error("Erreur ligne CSV:", e.message);
          }
        })
        .on("end", () => {
          console.log("Toutes les separations traitées :", separations.length);
          resolve(separations);
        })
        .on("error", (err) => reject(err));
    });
  }
}

module.exports = new SeparationImportService();
