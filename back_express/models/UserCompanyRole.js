// models/UserCompanyRole.js
const BaseModel = require('./BaseModel');

class UserCompanyRole extends BaseModel {
  constructor() {
    super('user_company_role');
  }

  // Assigner un rôle à un utilisateur pour une entreprise donnée
  async assignRole(userId, companyId, roleId, isDefault = false) {
    // Si on définit cette entreprise comme default, on retire le statut default des autres
    if (isDefault) {
      await this.query(
        `UPDATE user_company_role 
         SET is_default = false 
         WHERE user_id = $1`,
        [userId]
      );
    }

    const result = await this.query(
      `INSERT INTO user_company_role (user_id, company_id, role_id, is_default)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, company_id) 
       DO UPDATE SET role_id = $3, is_default = $4
       RETURNING *`,
      [userId, companyId, roleId, isDefault]
    );

    return result.rows[0];
  }

  // Récupérer tous les rôles d'un utilisateur
  async getUserRoles(userId) {
    const result = await this.query(
      `SELECT ucr.*, c.company_name
       FROM user_company_role ucr
       JOIN company c ON ucr.company_id = c.company_id
       WHERE ucr.user_id = $1 AND c.is_active = true`,
      [userId]
    );
    return result.rows;
  }

  // Récupérer l'entreprise par défaut d'un utilisateur
  async getDefaultCompany(userId) {
    const result = await this.query(
      `SELECT c.* 
       FROM company c
       JOIN user_company_role ucr ON c.company_id = ucr.company_id
       WHERE ucr.user_id = $1 AND ucr.is_default = true AND c.is_active = true
       LIMIT 1`,
      [userId]
    );
    return result.rows[0];
  }

  // Mettre à jour l'entreprise par défaut
  async updateDefaultCompany(userId, companyId) {
    return this.withTransaction(async (client) => {
      // Réinitialiser toutes les entreprises par défaut
      await client.query(
        `UPDATE user_company_role 
         SET is_default = false 
         WHERE user_id = $1`,
        [userId]
      );

      // Définir la nouvelle entreprise par défaut
      const result = await client.query(
        `UPDATE user_company_role 
         SET is_default = true 
         WHERE user_id = $1 AND company_id = $2
         RETURNING *`,
        [userId, companyId]
      );

      return result.rows[0];
    });
  }

  // Retirer un utilisateur d'une entreprise
  async removeUserFromCompany(userId, companyId) {
    const result = await this.query(
      `DELETE FROM user_company_role 
       WHERE user_id = $1 AND company_id = $2
       RETURNING *`,
      [userId, companyId]
    );
    return result.rows[0];
  }
}

module.exports = UserCompanyRole;
