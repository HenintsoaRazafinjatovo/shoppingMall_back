const fs = require("fs");
const csv = require("csv-parser");

class SalarySlipImportService {
  async prepareSalaries(filePath) {
    return new Promise((resolve, reject) => {
      const salaries = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          console.log("Colonnes détectées dans le CSV:", headers);
        })
        .on("data", (row) => {
          try {
            // CHAMPS OBLIGATOIRES POUR LES ASSIGNATIONS DE SALAIRE
            const requiredFields = [
              "employee",
              "start_of_month",
              "salary_structure",
              "base_salary"
            ];

            for (const field of requiredFields) {
              if (!row[field] || row[field].trim() === "") {
                throw new Error(
                  `Ligne ignorée : ${field} vide. Données: ${JSON.stringify(row)}`
                );
              }
            }

            const mois_date = row["start_of_month"].trim();

            // Calcul automatique du start_date et end_date
            const start_date = mois_date; // date du CSV, format YYYY-MM-DD
            const [year, month] = start_date.split("-").map(Number);
            const last_day = new Date(year, month, 0).getDate();
            const end_date = `${year}-${String(month).padStart(2,"0")}-${last_day}`;

            const salary = {
              employee: row["employee"].trim(),
              start_of_month: start_date,
              end_date: end_date,
              salary_structure: row["salary_structure"].trim(),
              base_salary: parseFloat(row["base_salary"]),
            };

            console.log("Bulletin de salaire transformé :", salary);
            salaries.push(salary);
          } catch (e) {
            console.error("Erreur ligne CSV:", e.message);
          }
        })
        .on("end", () => {
          console.log("Tous les bulletins de salaire traités :", salaries.length);
          resolve(salaries);
        })
        .on("error", (err) => reject(err));
    });
  }
}

module.exports = new SalarySlipImportService();
