const BaseModel = require('./BaseModel');

class UserSession extends BaseModel {
  constructor() {
    super('user_session'); 
  }

  async create(sessionData) {
    const {
      userId,
      companyId = null,
      accessToken,
      refreshToken,
      accessTokenExpiry,
      refreshTokenExpiry
    } = sessionData;

    const result = await this.query(
      `INSERT INTO user_session 
       (user_id, company_id, access_token, refresh_token, access_token_expiry, refresh_token_expiry) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING session_id, user_id, company_id, login_time, last_activity, is_active`,
      [userId, companyId, accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry]
    );

    return result.rows[0];
  }

  async findByAccessToken(accessToken) {
    const result = await this.query(
      `SELECT session_id, user_id, company_id, access_token, refresh_token, 
              access_token_expiry, refresh_token_expiry, is_active, login_time, last_activity
       FROM user_session 
       WHERE access_token = $1 AND is_active = true`,
      [accessToken]
    );
    return result.rows[0];
  }

  async invalidateSession(sessionId) {
    const result = await this.query(
      `UPDATE user_session 
       SET is_active = false, last_activity = NOW()
       WHERE session_id = $1
       RETURNING session_id`,
      [sessionId]
    );
    return result.rows[0];
  }

  async invalidateAllUserSessions(userId) {
    const result = await this.query(
      `UPDATE user_session 
       SET is_active = false, last_activity = NOW()
       WHERE user_id = $1 AND is_active = true`,
      [userId]
    );
    return result.rowCount; 
  }

  async updateLastActivity(sessionId) {
    const result = await this.query(
      `UPDATE user_session
       SET last_activity = NOW()
       WHERE session_id = $1
       RETURNING session_id, last_activity`,
      [sessionId]
    );
    return result.rows[0];
  }

  async updateSessionTokens(sessionId, { accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry }) {
  const result = await this.query(
    `UPDATE user_session
     SET access_token = $1,
         refresh_token = $2,
         access_token_expiry = $3,
         refresh_token_expiry = $4,
         last_activity = NOW()
     WHERE session_id = $5
     RETURNING *`,
    [accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry, sessionId]
  );
  return result.rows[0];
}

  async findByRefreshToken(refreshToken) {
    const result = await this.query(
      `SELECT session_id, user_id, company_id, access_token, refresh_token,
              access_token_expiry, refresh_token_expiry, is_active, login_time, last_activity
       FROM user_session
       WHERE refresh_token = $1 AND is_active = true`,
      [refreshToken]
    );
    return result.rows[0];
  }
}

module.exports = UserSession;
