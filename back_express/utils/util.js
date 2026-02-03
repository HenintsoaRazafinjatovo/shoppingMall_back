// utils/util.js
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

class Util {
  /**
   * Convertit une date en string "yyyy-MM-dd" en testant plusieurs formats possibles.
   * @param {string} input - La date en format "dd/MM/yyyy", "d/M/yyyy", "dd-MM-yyyy", "d-M-yyyy"
   * @returns {string} - La date formatée en "yyyy-MM-dd"
   * @throws {Error} - Si aucun format ne correspond
   */
  static formatDate(input) {
    if (!input) throw new Error("Date vide");

    const possibleFormats = ["DD/MM/YYYY", "D/M/YYYY", "DD-MM-YYYY", "D-M-YYYY"];

    for (const format of possibleFormats) {
      const parsed = dayjs(input, format, true); // true = strict parsing
      if (parsed.isValid()) {
        return parsed.format("YYYY-MM-DD");
      }
    }

    throw new Error(`Format de date invalide : ${input}`);
  }
}

module.exports = Util;
