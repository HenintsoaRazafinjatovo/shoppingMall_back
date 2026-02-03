const ResetService = require("../../services/reset/resetService"); // ton service Node qui appelle Frappe

async function resetDatabase(req, res) {
  try {
    console.log("Début du reset ERPNext via API");

    const result = await ResetService.resetDatabase();
    console.log("Réponse ERPNext:", result);

    res.json({
      success: true,
      message: "Base de données réinitialisée avec succès",
      result
    });
  } catch (err) {
    console.error("Erreur lors du reset:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

module.exports = { resetDatabase };
