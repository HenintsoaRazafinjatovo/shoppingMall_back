const BaseModel = require('./BaseModel');

class Role extends BaseModel {
  constructor() {
    super('role');
  }

  async create(roleData) {
    const { roleName, description = '' } = roleData;

    return this.withTransaction(async (client) => {
      const existingRole = await client.query(
        'SELECT role_id FROM role WHERE role_name = $1',
        [roleName]
      );

      if (existingRole.rows.length > 0) {
        throw new Error('Role already exists');
      }

      const result = await client.query(
        `INSERT INTO role (role_name, description, is_active)
         VALUES ($1, $2, $3)
         RETURNING role_id, role_name, description, is_active, created_at`,
        [roleName, description, true]
      );

      return result.rows[0];
    });
  }

  async findById(roleId) {
    const result = await this.query(
      `SELECT role_id, role_name, description, is_active, created_at
       FROM role
       WHERE role_id = $1`,
      [roleId]
    );
    return result.rows[0];
  }

  async findAll(conditions = {}) {
    return await super.findAll(conditions);
  }

  async findByName(roleName) {
    const result = await this.query(
      `SELECT role_id, role_name, description, is_active, created_at
       FROM role
       WHERE role_name = $1`,
      [roleName]
    );
    return result.rows[0];
  }

  async update(roleId, updates) {
    const { roleName, description, isActive } = updates;
    const result = await this.query(
      `UPDATE role
       SET role_name = COALESCE($1, role_name),
           description = COALESCE($2, description),
           is_active = COALESCE($3, is_active)
       WHERE role_id = $4
       RETURNING role_id, role_name, description, is_active, created_at`,
      [roleName, description, isActive, roleId]
    );
    return result.rows[0];
  }

  async softDelete(roleId) {
    const result = await this.query(
      `UPDATE role
       SET is_active = false
       WHERE role_id = $1
       RETURNING role_id`,
      [roleId]
    );
    return result.rows[0];
  }
}

module.exports = Role;
