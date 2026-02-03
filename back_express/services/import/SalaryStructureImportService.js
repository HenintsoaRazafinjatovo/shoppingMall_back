const fs = require("fs");
const csv = require("csv-parser");

class SalaryStructureImportService {
  async prepareStructures(filePath) {
    return new Promise((resolve, reject) => {
      const structures = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          console.log("Colonnes détectées dans le CSV:", headers);
        })
        .on("data", (row) => {
          try {
            // CHAMPS OBLIGATOIRES POUR LES STRUCTURES DE SALAIRE
            const requiredFields = [
              "salary_structure", 
              "name", 
              "abbr", 
              "type", 
              "formula", 
              "company"
            ];

            for (const field of requiredFields) {
              if (!row[field] || row[field].trim() === "") {
                throw new Error(
                  `Ligne ignorée : ${field} vide. Données: ${JSON.stringify(row)}`
                );
              }
            }

            const structure = {
              salary_structure: row["salary_structure"].trim(),
              name: row["name"].trim(),
              abbr: row["abbr"].trim(),
              type: row["type"].trim(),       // earning ou deduction
              formula: row["formula"].trim(),
              company: row["company"].trim()
            };

            console.log("Structure de salaire transformée :", structure);
            structures.push(structure);
          } catch (e) {
            console.error("Erreur ligne CSV:", e.message);
          }
        })
        .on("end", () => {
          console.log("Toutes les structures traitées :", structures.length);
          resolve(structures);
        })
        .on("error", (err) => reject(err));
    });
  }
}

module.exports = new SalaryStructureImportService();
