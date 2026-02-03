const fs = require("fs");
const csv = require("csv-parser");

class TimesheetImportService {
  async prepareTimesheets(filePath) {
    return new Promise((resolve, reject) => {
      const timesheets = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          console.log("Colonnes détectées dans le CSV:", headers);
        })
        .on("data", (row) => {
          try {
            // Champs obligatoires
            const requiredFields = [
              "employee",
              "start_date",
              "end_date",
              "activity_type",
              "hours",
              "project",
              "company"
            ];

            for (const field of requiredFields) {
              if (!row[field] || row[field].trim() === "") {
                throw new Error(
                  `Ligne ignorée : ${field} vide. Données: ${JSON.stringify(row)}`
                );
              }
            }

            const timesheet = {
              employee: row["employee"].trim(),
              start_date: row["start_date"].trim(),
              end_date: row["end_date"].trim(),
              activity_type: row["activity_type"].trim(),
              hours: parseFloat(row["hours"].trim()), // converti en nombre
              project: row["project"].trim(),
              company: row["company"].trim(),
            };

            console.log("Timesheet transformé :", timesheet);
            timesheets.push(timesheet);
          } catch (e) {
            console.error("Erreur ligne CSV:", e.message);
          }
        })
        .on("end", () => {
          console.log("Tous les timesheets traités :", timesheets.length);
          resolve(timesheets);
        })
        .on("error", (err) => reject(err));
    });
  }
}

module.exports = new TimesheetImportService();
