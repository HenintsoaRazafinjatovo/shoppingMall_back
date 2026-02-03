const fs = require("fs");
const csv = require("csv-parser");

class EmployeeImportService {
  async prepareEmployees(filePath) {
    return new Promise((resolve, reject) => {
      const employees = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("headers", (headers) => {
          console.log("Colonnes détectées dans le CSV:", headers);
        })
        .on("data", (row) => {
          try {
            // CHAMPS OBLIGATOIRES POUR LES EMPLOYÉS
            const requiredFields = [
              "employee_name", 
              "first_name", 
              "last_name",
              "gender", 
              "date_of_joining", 
              "date_of_birth", 
              "company"
            ];

            for (const field of requiredFields) {
              if (!row[field] || row[field].trim() === "") {
                throw new Error(
                  `Ligne ignorée : ${field} vide. Données: ${JSON.stringify(row)}`
                );
              }
            }

            const employee = {
              employee_name: row["employee_name"].trim(),
              first_name: row["first_name"].trim(),
              last_name: row["last_name"].trim(),
              gender: row["gender"].trim(),
              date_of_joining: row["date_of_joining"].trim(),
              date_of_birth: row["date_of_birth"].trim(),
              company: row["company"].trim()
            };

            console.log("Employé transformé :", employee);
            employees.push(employee);
          } catch (e) {
            console.error("Erreur ligne CSV:", e.message);
          }
        })
        .on("end", () => {
          console.log("Tous les employés traités :", employees.length);
          resolve(employees);
        })
        .on("error", (err) => reject(err));
    });
  }
}

module.exports = new EmployeeImportService();
