const fs = require("fs");
const csv = require("csv-parser");

class AttendanceImportService {
  async prepareAttendances(filePath) {
    return new Promise((resolve, reject) => {
      const attendances = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          console.log("Colonnes détectées dans le CSV:", headers);
        })
        .on("data", (row) => {
          try {
            // Champs obligatoires
            const requiredFields = ["employee", "attendance_date", "status", "company"];

            for (const field of requiredFields) {
              if (!row[field] || row[field].trim() === "") {
                throw new Error(
                  `Ligne ignorée : ${field} vide. Données: ${JSON.stringify(row)}`
                );
              }
            }

            const attendance = {
              employee: row["employee"].trim(),
              attendance_date: row["attendance_date"].trim(),
              status: row["status"].trim(),
              company: row["company"].trim(),
            };

            console.log("Attendance transformée :", attendance);
            attendances.push(attendance);
          } catch (e) {
            console.error("Erreur ligne CSV:", e.message);
          }
        })
        .on("end", () => {
          console.log("Toutes les présences traitées :", attendances.length);
          resolve(attendances);
        })
        .on("error", (err) => reject(err));
    });
  }
}

module.exports = new AttendanceImportService();
