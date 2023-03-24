const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

// добавьте это в db.js
async function setLang(chatId, lang) {
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
async function getLang(chatId) {
  const query = {
    text: 'SELECT lang FROM users WHERE chat_id = $1',
    values: [chatId],
  };
  try {
    const result = await pool.query(query);
    return result.rows[0] ? result.rows[0].lang : null;
  } catch (error) {
    console.error('Error getting language:', error);
    return null;
  }
}

// добавьте это в конец db.js
module.exports = {
  pool,
  setLang,
  getLang,
};
