const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports.query = (text, params) => pool.query(text, params);

// добавьте это в db.js
module.exports.setLang = async (chatId, lang) => {
  const query = {
    text: 'UPDATE users SET lang = $1 WHERE chat_id = $2',
    values: [lang, chatId],
  };
  try {
    await pool.query(query);
  } catch (error) {
    console.error('Error setting language:', error);
  }
}

module.exports.getLang = async (chatId) => {
  const query = {
    text: 'SELECT lang FROM users WHERE chat_id = $1',
    values: [chatId],
  };
  try {
    const result = await pool.query(query);
    return result.rows[0].lang;
  } catch (error) {
    console.error('Error getting language:', error);
    return null;
  }
}
