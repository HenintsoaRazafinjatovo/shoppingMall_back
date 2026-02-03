const { pool } = require('../config/database');

class BaseModel00 {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = pool;
  }

  async query(text, params) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async withTransaction(callback) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(id) {
    const result = await this.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async findAll(conditions = {}) {
    let query = `SELECT * FROM ${this.tableName}`;
    const values = [];
    const whereClauses = [];

    Object.keys(conditions).forEach((key, index) => {
      whereClauses.push(`${key} = $${index + 1}`);
      values.push(conditions[key]);
    });

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const result = await this.query(query, values);
    return result.rows;
  }
}

module.exports = BaseModel;