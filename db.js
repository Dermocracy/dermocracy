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

async function isUserPresident(chatId, userId) {
  // Здесь вы можете добавить логику для проверки, является ли пользователь президентом чата.
  // Верните true, если пользователь является президентом, и false в противном случае.
}

async function getImpeachmentStatus(chatId) {
  // Здесь вы можете добавить логику для получения статуса импичмента для чата.
  // Верните объект с информацией о статусе импичмента или null, если нет активного процесса импичмента.
}

async function startImpeachmentInDB(chatId, endTime) {
  // Здесь вы можете добавить логику для установки статуса импичмента в базе данных.
}

async function updateImpeachmentStatusInDB(chatId, status) {
  // Здесь вы можете добавить логику для обновления статуса импичмента в базе данных.
}
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
// добавьте это в конец db.js
module.exports = {
  pool,
  getUsers,
  getUserByChatId,
  createUser,
  updateUser,
  deleteUser,
  setLang, // добавьте эту строку
};
