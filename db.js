const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Функция для выполнения SQL-запросов
module.exports.query = (text, params) => pool.query(text, params);

// Функция для установки языка пользователя
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

// Функция для получения языка пользователя
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

// Функция для создания или обновления пользователя
module.exports.createOrUpdateUser = async (chatId, lang) => {
  console.log('createOrUpdateUser called with chatId:', chatId, 'lang:', lang);
  const query = {
    text: 'SELECT * FROM users WHERE chat_id = $1',
    values: [chatId],
  };
  try {
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      await createUser(chatId, lang);
    } else {
      await updateUser(chatId, lang);
    }
  } catch (error) {
    console.error('Error creating or updating user:', error);
  }
};

// Функция для обновления пользователя
module.exports.updateUser = async (chatId, lang) => {
  const query = {
    text: 'UPDATE users SET lang = $1 WHERE chat_id = $2',
    values: [lang, chatId],
  };
  try {
    await pool.query(query);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

// Функция для получения списка кандидатов
module.exports.getCandidates = async () => {
  const query = "SELECT * FROM candidates";
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error getting candidates:", error);
    return [];
  }
};

// Функция для голосования за кандидата
module.exports.voteForCandidate = async (chatId, candidateId) => {
  const query = {
    text: "INSERT INTO votes (voter_chat_id, candidate_chat_id) VALUES ($1, $2) ON CONFLICT (voter_chat_id) DO UPDATE SET candidate_chat_id = $2",
    values: [chatId, candidateId],
  };
  try {
    await pool.query(query);
    return true;
  } catch (error) {
    console.error("Error voting for candidate:", error);
    return false;
  }
};

// Функция для регистрации кандидата в базе данных
module.exports.registerCandidateInDB = async (chatId) => {
  const query = {
    text: "INSERT INTO candidates (chat_id) VALUES ($1) ON CONFLICT (chat_id) DO NOTHING",
    values: [chatId],
  };
  try {
    await pool.query(query);
  } catch (error) {
    console.error("Error registering candidate:", error);
  }
};

// Функция для проверки регистрации кандидата
module.exports.isRegisteredCandidate = async (chatId) => {
  const query = {
    text: "SELECT * FROM candidates WHERE chat_id = $1",
    values: [chatId],
  };
  try {
    const result = await pool.query(query);
    return result.rowCount > 0;
  } catch (error) {
    console.error("Error checking candidate registration:", error);
    return false;
  }
};

// Функция для начала выборов и сброса голосов
module.exports.startElection = async () => {
  const query = "UPDATE candidates SET votes = 0";
  try {
    await pool.query(query);
  } catch (error) {
    console.error("Error starting election:", error);
  }
};
// Функция для создания пользователя
module.exports.createUser = async (chatId, lang) => {
  const query = {
    text: 'INSERT INTO users (chat_id, lang) VALUES ($1, $2)',
    values: [chatId, lang],
  };
  try {
    await pool.query(query);
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Функция для обновления пользователя
module.exports.updateUser = async (chatId, lang) => {
  const query = {
    text: 'UPDATE users SET lang = $1 WHERE chat_id = $2',
    values: [lang, chatId],
  };
  try {
    await pool.query(query);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

// Функция для создания или обновления пользователя
module.exports.createOrUpdateUser = async (chatId, lang) => {
  const query = {
    text: 'SELECT * FROM users WHERE chat_id = $1',
    values: [chatId],
  };
  try {
    const result = await pool.query(query);
    if (result.rows.length === 0) {
      await createUser(chatId, lang);
    } else {
      await updateUser(chatId, lang);
    }
  } catch (error) {
    console.error('Error creating or updating user:', error);
  }
};
// Функция для обновления пользователя
module.exports.updateUser = async (chatId, lang) => {
  const query = {
    text: 'UPDATE users SET lang = $1 WHERE chat_id = $2',
    values: [lang, chatId],
  };
  try {
    await pool.query(query);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};
