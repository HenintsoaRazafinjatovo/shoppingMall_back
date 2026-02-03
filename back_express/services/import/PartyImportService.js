const fs = require("fs");
const csv = require("csv-parser");

class PartyImportService {
  async prepareParties(filePath) {
    return new Promise((resolve, reject) => {
      const parties = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          console.log("Colonnes détectées dans le CSV:", headers);
        })
        .on("data", (row) => {
          try {
            // Champs obligatoires
            const requiredFields = [
              "party_type", // Supplier ou Customer
              "party_name",
              "party_category",
              "company"
            ];

            for (const field of requiredFields) {
              if (!row[field] || row[field].trim() === "") {
                throw new Error(`Ligne ignorée : ${field} vide. Données: ${JSON.stringify(row)}`);
              }
            }

            const party = {
              party_type: row["party_type"].trim(),
              party_name: row["party_name"].trim(),
              party_category: row["party_category"].trim(),
              company: row["company"].trim()
            };

            console.log("Party transformée :", party);
            parties.push(party);
          } catch (e) {
            console.error("Erreur ligne CSV:", e.message);
          }
        })
        .on("end", () => {
          console.log("Toutes les parties traitées :", parties.length);
          resolve(parties);
        })
        .on("error", (err) => reject(err));
    });
  }
}

module.exports = new PartyImportService();
