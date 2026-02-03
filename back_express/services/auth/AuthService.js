const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const Company = require('../../models/Company');
const Role = require('../../models/Role');
const UserCompanyRole = require('../../models/UserCompanyRole');
const { generateTokens } = require('../../utils/jwt');

const ms = require('ms');

class AuthService {
  constructor() {
    this.user = new User();
    this.session = new UserSession();
    this.company = new Company();
    this.role = new Role();
    this.userCompanyRole = new UserCompanyRole();
  }

  async signup(userData) {
    try {
      // Créer l'utilisateur
      const user = await this.user.create(userData);
      
      // Générer des tokens (companyId sera null au début)
      const tokenPayload = {
        userId: user.user_id,
        email: user.email
      };

      const tokens = generateTokens(tokenPayload);

    //   const accessTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    //   const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours

      const accessTokenExpiry = new Date(Date.now() + ms(process.env.JWT_EXPIRES_IN));
      const refreshTokenExpiry = new Date(Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN));

      // Créer la session
      const session = await this.session.create({
        userId: user.user_id,
        companyId: null, // Pas d'entreprise encore
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        accessTokenExpiry,
        refreshTokenExpiry
      });

      return {
        success: true,
        user: {
          userId: user.user_id,
          email: user.email,
          userName: user.user_name
        },
        tokens,
        requiresCompany: true // Indique qu'il faut créer une entreprise
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async completeSignup(userId, companyData) {
    try {
      // Créer l'entreprise
    //   const company = await this.company.create({
    //     ...companyData,
    //     createdBy: userId
    //   });

    const company = await this.company.create(companyData);
    const roleId = (await this.role.findByName('Admin')).role_id;
      // Assigner le rôle Admin
      await this.userCompanyRole.assignRole(
        userId, 
        company.company_id, 
        roleId, 
        true
      );
    
      const user = (await this.user.findById(userId))
      const email = (await this.user.findById(userId)).email;

      // Générer de nouveaux tokens avec la companyId
      const tokenPayload = {
        userId: userId,
        companyId: company.company_id,
        email: email
      };

      const tokens = generateTokens(tokenPayload);

    //   // Calculer les nouvelles dates d'expiration
    //   const accessTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    //   const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);


      const accessTokenExpiry = new Date(Date.now() + ms(process.env.JWT_EXPIRES_IN));
      const refreshTokenExpiry = new Date(Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN));

      // Invalider l'ancienne session
      await this.session.invalidateAllUserSessions(userId);

      // Créer une nouvelle session avec la companyId
      const newSession = await this.session.create({
        userId: userId,
        companyId: company.company_id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        accessTokenExpiry,
        refreshTokenExpiry
      });

      return {
        success: true,
        user : user,
        company: {
          companyId: company.company_id,
          name: company.company_name
        },
        tokens
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async login(email, password) {
    try {
      const user = await this.user.findByEmail(email);
      if (!user || !user.is_active) {
        throw new Error('Invalid credentials');
      }

      const validPassword = await this.user.verifyPassword(password, user.password_hash);
      if (!validPassword) {
        throw new Error('Invalid credentials');
      }

      // Récupérer l'entreprise par défaut
      const defaultCompany = await this.userCompanyRole.getDefaultCompany(user.user_id);

      const tokenPayload = {
        userId: user.user_id,
        companyId: defaultCompany?.company_id,
        email: user.email
      };

      const tokens = generateTokens(tokenPayload);

      // Calculer les dates d'expiration
    //   const accessTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    //   const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);


      const accessTokenExpiry = new Date(Date.now() + ms(process.env.JWT_EXPIRES_IN));
      const refreshTokenExpiry = new Date(Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN));

      // Invalider les anciennes sessions
      await this.session.invalidateAllUserSessions(user.user_id);

      // Créer une nouvelle session
      const session = await this.session.create({
        userId: user.user_id,
        companyId: defaultCompany?.company_id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        accessTokenExpiry,
        refreshTokenExpiry
      });

      return {
        success: true,
        data: {
          // user: {
          //   userId: user.user_id,
          //   email: user.email,
          //   firstName: user.first_name,
          //   lastName: user.last_name
          // },
          user : user,
          company: defaultCompany,
          requiresCompany: !defaultCompany,
          tokens
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async logout(accessToken) {
    try {
      // Trouver la session par le token
      const session = await this.session.findByAccessToken(accessToken);
      
      if (session) {
        // Invalider la session
        await this.session.invalidateSession(session.session_id);
      }
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async refreshTokens(refreshToken) {
    try {
      // Vérifier le refresh token
      const session = await this.session.findByRefreshToken(refreshToken);
      
      if (!session || new Date() > new Date(session.refresh_token_expiry)) {
        throw new Error('Invalid or expired refresh token');
      }

      // Générer de nouveaux tokens
      const tokenPayload = {
        userId: session.user_id,
        companyId: session.company_id,
        email: session.email // Vous devriez avoir l'email stocké ailleurs
      };

      const tokens = generateTokens(tokenPayload);

      // Calculer les nouvelles dates d'expiration
    //   const accessTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    //   const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);


      const accessTokenExpiry = new Date(Date.now() + ms(process.env.JWT_EXPIRES_IN));
      const refreshTokenExpiry = new Date(Date.now() + ms(process.env.JWT_REFRESH_EXPIRES_IN));

      // Mettre à jour la session avec les nouveaux tokens
    //   await this.query(
    //     `UPDATE user_session 
    //      SET access_token = $1, refresh_token = $2,
    //          access_token_expiry = $3, refresh_token_expiry = $4,
    //          last_activity = NOW()
    //      WHERE session_id = $5`,
    //     [tokens.accessToken, tokens.refreshToken, accessTokenExpiry, refreshTokenExpiry, session.session_id]
    //   );

        await this.session.updateSessionTokens(session.session_id, {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        accessTokenExpiry,
        refreshTokenExpiry
        });


      return {
        success: true,
        tokens
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = AuthService;