const { pool } = require('./config/database');

async function testConnection() {
  try {
    // on fait une requête toute simple
    const res = await pool.query('SELECT NOW() AS current_time');
    console.log('Connexion réussie ! Heure PostgreSQL :', res.rows[0].current_time);
  } catch (err) {
    console.error('Erreur de connexion à la base :', err.message);
  } finally {
    // on libère le pool proprement
    await pool.end();
  }
}

testConnection();
