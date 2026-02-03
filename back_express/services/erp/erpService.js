const axios = require('axios');
const ERP_API_URL = process.env.ERP_API_URL ;
const ERP_API_KEY = process.env.ERP_API_KEY;
const ERP_API_SECRET = process.env.ERP_API_SECRET;

/**
 * Appel générique à l’API ERPNext
 * @param {string} endpoint - Chemin API, ex: '/api/resource/Item'
 * @param {string} method - Méthode HTTP, ex: 'GET', 'POST'
 * @param {object|null} data - Corps de la requête (pour POST/PUT)
 * @param {object|null} params - Query params (pour GET)
 * @returns {Promise<object>} - Réponse JSON de l’API ERPNext
 */
async function callERPNextAPI(endpoint, method = 'GET', data = null, params = null) {
  try {
    const url = `${ERP_API_URL}${endpoint}`;

    const options = {
      method,
      url,
      headers: {
        Authorization: `token ${ERP_API_KEY}:${ERP_API_SECRET}`
      },
      params
    };

    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      options.headers['Content-Type'] = 'application/json';
      options.data = data;
    }

    const response = await axios(options);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Erreur ERPNext API (${error.response.status}): ${JSON.stringify(error.response.data)}`);
    } else {
      throw new Error(`Erreur requête API: ${error.message}`);
    }
  }
}

module.exports = {
  callERPNextAPI
};
