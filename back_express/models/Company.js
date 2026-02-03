const BaseModel = require('./BaseModel');

class Company extends BaseModel {
  constructor() {
    super('company');
  }

  async create(companyData) {
    const { companyName, address = '', country = 'Madagascar', currency = 'MGA' } = companyData;

    return this.withTransaction(async (client) => {
      const existingCompany = await client.query(
        'SELECT company_id FROM company WHERE company_name = $1',
        [companyName]
      );

      if (existingCompany.rows.length > 0) {
        throw new Error('Company already exists');
      }

      const result = await client.query(
        `INSERT INTO company (company_name, address, country, currency, is_active)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING company_id, company_name, address, country, currency, is_active, created_at`,
        [companyName, address, country, currency, true]
      );

      return result.rows[0];
    });
  }

  async findById(companyId) {
    const result = await this.query(
      `SELECT company_id, company_name, address, country, currency, is_active, created_at, updated_at
       FROM company
       WHERE company_id = $1`,
      [companyId]
    );
    return result.rows[0];
  }

  async findAll(conditions = {}) {
    return await super.findAll(conditions);
  }

  async findByName(companyName) {
    const result = await this.query(
      `SELECT company_id, company_name, address, country, currency, is_active, created_at, updated_at
       FROM company
       WHERE company_name = $1`,
      [companyName]
    );
    return result.rows[0];
  }

  async update(companyId, updates) {
    const { companyName, address, country, currency, isActive } = updates;
    const result = await this.query(
      `UPDATE company
       SET company_name = COALESCE($1, company_name),
           address = COALESCE($2, address),
           country = COALESCE($3, country),
           currency = COALESCE($4, currency),
           is_active = COALESCE($5, is_active),
           updated_at = NOW()
       WHERE company_id = $6
       RETURNING company_id, company_name, address, country, currency, is_active, updated_at`,
      [companyName, address, country, currency, isActive, companyId]
    );
    return result.rows[0];
  }

  async softDelete(companyId) {
    const result = await this.query(
      `UPDATE company
       SET is_active = false, updated_at = NOW()
       WHERE company_id = $1
       RETURNING company_id`,
      [companyId]
    );
    return result.rows[0];
  }
}

module.exports = Company;
