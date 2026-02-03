const BaseModel = require('./BaseModel');
const { hashPassword, verifyPassword } = require('../utils/password');

class User00 extends BaseModel {
  constructor() {
    super('user_app');
  }

  async create_v1(userData) {
    const { email, password, userName = '', phone = '' } = userData;

    return this.withTransaction(async (client) => {
      const existingUser = await client.query(
        'SELECT user_id FROM user_app WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
      }

      const hashedPassword = await hashPassword(password);

      const result = await client.query(
        `INSERT INTO user_app (email, password_hash, user_name, phone, is_active)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING user_id, email, user_name, phone, created_at`,
        [email, hashedPassword, userName, phone, true]
      );

      return result.rows[0];
    });
  }

  async create(userData) {
    const { email, password, userName = '', phone = '' } = userData;

    return this.withTransaction(async (client) => {
      const existingUser = await client.query(
        'SELECT user_id FROM user_app WHERE email = $1',
        [email]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('User already exists');
      }

      const hashedPassword = await hashPassword(password);

      const result = await client.query(
        `INSERT INTO user_app (email, password_hash, user_name, phone, is_active, profile_picture_path)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING user_id, email, user_name, phone, profile_picture_path, created_at`,
        [email, hashedPassword, userName, phone, true, '/home/tropicool-boy/LUCAS/Stage/nextjs-admin-dashboard-main/public/images/user/smart_user2.jpeg']
      );

      return result.rows[0];
    });
  }

  // async findByEmail(email) {
  //   const result = await this.query(
  //     `SELECT user_id, email, password_hash, user_name, phone, is_active, created_at, updated_at
  //      FROM user_app 
  //      WHERE email = $1`,
  //     [email]
  //   );
  //   return result.rows[0];
  // }

  async findByEmail(email) {
    const result = await this.query(
      `SELECT user_id, email, password_hash, user_name, phone, is_active, created_at, updated_at, profile_picture_path
       FROM user_app 
       WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  }

  async findById(userId) {
    const result = await this.query(
      `SELECT user_id, email, user_name, phone, is_active, created_at, updated_at
       FROM user_app
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }

  async findAll(conditions = {}) {
    return await super.findAll(conditions);
  }

  async updateProfile(userId, updates) {
    const { userName, phone } = updates;
    const result = await this.query(
      `UPDATE user_app
       SET user_name = COALESCE($1, user_name),
           phone = COALESCE($2, phone),
           updated_at = NOW()
       WHERE user_id = $3
       RETURNING user_id, email, user_name, phone, is_active, updated_at`,
      [userName, phone, userId]
    );
    return result.rows[0];
  }


  async updateProfile_v2(userId, updates) {
    // 1. Extraire tous les champs potentiels des mises à jour
    const { userName, phone, newPassword, profilePicturePath } = updates;

    return this.withTransaction(async (client) => {
      // 2. Préparer les parties dynamiques de la requête
      let queryParts = [];
      let queryParams = [];
      let paramIndex = 1;

      // 3. Gestion du mot de passe (SI un nouveau est fourni)
      if (newPassword) {
        const hashedPassword = await hashPassword(newPassword);
        queryParts.push(`password_hash = $${paramIndex}`);
        queryParams.push(hashedPassword);
        paramIndex++;
      }

      // 4. Gestion des autres champs (comme avant, mais dynamiquement)
      if (userName !== undefined) {
        queryParts.push(`user_name = $${paramIndex}`);
        queryParams.push(userName);
        paramIndex++;
      }

      if (phone !== undefined) {
        queryParts.push(`phone = $${paramIndex}`);
        queryParams.push(phone);
        paramIndex++;
      }

      // 5. Gestion de la photo de profil
      if (profilePicturePath !== undefined) {
        queryParts.push(`profile_picture_path = $${paramIndex}`);
        queryParams.push(profilePicturePath);
        paramIndex++;
      }

      // 6. Si aucun champ valide à mettre à jour n'a été trouvé, on peut lever une erreur ou retourner early
      if (queryParts.length === 0) {
        // Retourner l'utilisateur actuel ou throw new Error('No valid fields to update')
        const currentUser = await this.findById(userId);
        return currentUser;
      }

      // 7. Ajouter la mise à jour obligatoire de updated_at
      queryParts.push(`updated_at = NOW()`);

      // 8. Construire la requête finale
      // Ajouter le userId à la fin des paramètres
      queryParams.push(userId);
      const setClause = queryParts.join(', ');

      const finalQuery = `
        UPDATE user_app
        SET ${setClause}
        WHERE user_id = $${paramIndex}
        RETURNING user_id, email, user_name, phone, profile_picture_path, is_active, updated_at
      `;

      // 9. Exécuter la requête
      const result = await client.query(finalQuery, queryParams);
      return result.rows[0];
    });
  }

  async softDelete(userId) {
    const result = await this.query(
      `UPDATE user_app
       SET is_active = false, updated_at = NOW()
       WHERE user_id = $1
       RETURNING user_id`,
      [userId]
    );
    return result.rows[0];
  }

  async verifyPassword(plainPassword, hashedPassword) {
    return await verifyPassword(plainPassword, hashedPassword);
  }
}

module.exports = User;
