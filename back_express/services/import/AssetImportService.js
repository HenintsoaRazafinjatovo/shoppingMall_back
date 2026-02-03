const fs = require("fs");
const csv = require("csv-parser");

class AssetImportService {
  async prepareAssets(filePath) {
    return new Promise((resolve, reject) => {
      const assets = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          console.log("Colonnes détectées dans le CSV:", headers);
        })
        .on("data", (row) => {
          try {
            // CHAMPS OBLIGATOIRES POUR LES ASSETS
            const requiredFields = [
              "asset_name",             // Nom de l'actif
              "asset_category",         // Catégorie (ex. Machinery, Vehicles)
              "gross_purchase_amount",  // Valeur brute d'achat
              "depreciation_amount",    // Montant amortissable
              "purchase_date",          // Date d'achat
              "company"                 // Société
            ];

            for (const field of requiredFields) {
              if (!row[field] || row[field].trim() === "") {
                throw new Error(
                  `Ligne ignorée : ${field} vide. Données: ${JSON.stringify(row)}`
                );
              }
            }

            const asset = {
              asset_name: row["asset_name"].trim(),
              asset_category: row["asset_category"].trim(),
              gross_purchase_amount: parseFloat(row["gross_purchase_amount"]),
              depreciation_amount: parseFloat(row["depreciation_amount"]),
              purchase_date: row["purchase_date"].trim(),
              company: row["company"].trim()
            };

            console.log("Asset transformé :", asset);
            assets.push(asset);
          } catch (e) {
            console.error("Erreur ligne CSV:", e.message);
          }
        })
        .on("end", () => {
          console.log("Tous les Assets traités :", assets.length);
          resolve(assets);
        })
        .on("error", (err) => reject(err));
    });
  }
}

module.exports = new AssetImportService();
