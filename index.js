const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const translations = require('./lang');
const db = require('./database');

const bot = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

function getTranslation(lang, key) {
  return translations[lang] && translations[lang][key] ? translations[lang][key] : key;
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Отправка сообщения с выбором языка
  bot.sendMessage(
    chatId,
    'Выберите язык / Choose language',
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🇬🇧 English', callback_data: 'en' },
            { text: '🇷🇺 Русский', callback_data: 'ru' }
          ]
        ]
      }
    }
  );
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const lang = query.data;

  // Отправка приветственного сообщения на выбранном языке
  if (translations[lang]) {
    bot.sendMessage(chatId, getTranslation(lang, 'greetings'));
  } else {
    bot.sendMessage(chatId, 'Язык не поддерживается');
  }

  // Закрытие инлайн-клавиатуры
  bot.answerCallbackQuery(query.id);	
});

bot.onText(/\/menu/, (msg, match) => {
  const chatId = msg.chat.id;

  // Здесь можно установить язык в зависимости от выбора пользователя
  const lang = 'en';

  // Отправка главного меню с опциями
  bot.sendMessage(
    chatId,
    getTranslation(lang, 'mainMenu'),
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: getTranslation(lang, 'option1'), callback_data: 'option1' }],
          [{ text: getTranslation(lang, 'option2'), callback_data: 'option2' }],
          [{ text: getTranslation(lang, 'option3'), callback_data: 'option3' }],
        ],
      },
    },
  );
});

console.log('Dermocracy Bot запущен и ожидает сообщений...');
``
// ... импорт зависимостей и определение функций ...

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const lang = 'en'; // Здесь можно установить язык в зависимости от выбора пользователя
  const option = query.data;

  switch (option) {
    case 'en':
    case 'ru':
      bot.sendMessage(chatId, getTranslation(lang, 'greetings'));
      break;

    case 'option1':
      bot.sendMessage(chatId, getTranslation(lang, 'questionsList'));
      break;

    case 'option2':
      bot.sendMessage(chatId, getTranslation(lang, 'submitQuestion'));
      break;

    case 'option3':
      bot.sendMessage(chatId, getTranslation(lang, 'statistics'));
      break;

    default:
      bot.sendMessage(chatId, getTranslation(lang, 'unknownOption'));
      break;
  }

  // Закрытие инлайн-клавиатуры
  bot.answerCallbackQuery(query.id);
});

// ... Остальной код ...

// ... импорт зависимостей и определение функций ...

function voteOnQuestion(chatId, lang, questionId) {
  // Здесь мы будем получать вопрос из базы данных по questionId,
  // но сейчас просто используем заглушку
  const questionText = getTranslation(lang, 'sampleQuestion1');
  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: getTranslation(lang, 'yes'), callback_data: `vote_yes_${questionId}` },
        { text: getTranslation(lang, 'no'), callback_data: `vote_no_${questionId}` },
      ],
    ],
  };

  bot.sendMessage(chatId, `${getTranslation(lang, 'voteQuestion')} "${questionText}"`, {
    reply_markup: inlineKeyboard,
  });
}

function showVotingResults(chatId, lang, questionId) {
  // Здесь мы будем получать результаты голосования из базы данных по questionId,
  // но сейчас просто используем заглушку
  const yesVotes = 10;
  const noVotes = 5;

  bot.sendMessage(
    chatId,
    `${getTranslation(lang, 'votingResults')}\n${getTranslation(lang, 'yes')}: ${yesVotes}\n${getTranslation(lang, 'no')}: ${noVotes}`
  );
}

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const lang = 'en'; // Здесь можно установить язык в зависимости от выбора пользователя
  const [action, option, questionId] = query.data.split('_');

  if (action === 'vote') {
    showVotingResults(chatId, lang, questionId);
  } else {
    // ... другие опции ...

    if (option === 'option1') {
      showQuestions(chatId, lang);
    } else if (option === 'option2') {
      submitQuestion(chatId, lang);
    } else if (option.startsWith('vote')) {
      voteOnQuestion(chatId, lang, questionId);
    }

    // ... другие опции ...
  }

  // Закрытие инлайн-клавиатуры
  bot.answerCallbackQuery(query.id);
});

// ... Остальной код ...
// ... импорт зависимостей и определение функций ...

function showStats(chatId, lang) {
  // Здесь мы будем получать статистику из базы данных,
  // но сейчас просто используем заглушку
  const stats = {
    totalChats: 100,
    totalUsers: 500,
    totalVotes: 1000,
  };

  const statsText = getTranslation(lang, 'statsText')
    .replace('{totalChats}', stats.totalChats)
    .replace('{totalUsers}', stats.totalUsers)
    .replace('{totalVotes}', stats.totalVotes);

  bot.sendMessage(chatId, statsText);
}

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const lang = 'en'; // Здесь можно установить язык в зависимости от выбора пользователя
  const [action, option, questionId] = query.data.split('_');

  if (action === 'vote') {
    showVotingResults(chatId, lang, questionId);
  } else {
    // ... другие опции ...

    if (option === 'option1') {
      showQuestions(chatId, lang);
    } else if (option === 'option2') {
      submitQuestion(chatId, lang);
    } else if (option.startsWith('vote')) {
      voteOnQuestion(chatId, lang, questionId);
    } else if (option === 'option3') {
      showStats(chatId, lang);
    }

    // ... другие опции ...
  }

  // Закрытие инлайн-клавиатуры
  bot.answerCallbackQuery(query.id);
});

// ... Остальной код ...
// Регистрация кандидата
async function registerCandidate(chatId, candidateId, program) {
  const result = await db.query(
    'INSERT INTO candidates (chat_id, user_id, program) VALUES ($1, $2, $3) ON CONFLICT (chat_id, user_id) DO UPDATE SET program = EXCLUDED.program',
    [chatId, candidateId, program]
  );
  return result.rowCount > 0;
}

// Получение списка кандидатов
async function getCandidates(chatId) {
  const result = await db.query('SELECT * FROM candidates WHERE chat_id = $1', [chatId]);
  return result.rows;
}

// Начать выборы
async function startElection(chatId) {
  const candidates = await getCandidates(chatId);
  // Здесь можно начать процесс выборов, используя информацию о кандидатах
}

// Импичмент президента
async function impeachPresident(chatId, presidentId) {
  const result = await db.query(
    'DELETE FROM presidents WHERE chat_id = $1 AND user_id = $2',
    [chatId, presidentId]
  );
  return result.rowCount > 0;
}

// Получить результаты выборов
async function getElectionResults(chatId) {
  // Здесь можно получить результаты выборов
}

// Получить текущего президента
async function getPresident(chatId) {
  const result = await db.query('SELECT * FROM presidents WHERE chat_id = $1', [chatId]);
  return result.rows[0];
}
const { getLang } = require('./lang');

bot.onText(/\/register_candidate/, async (msg, match) => {
  const chatId = msg.chat.id;
  const candidateId = msg.from.id;
  const program = match.input.split(' ').slice(1).join(' ');
  const lang = await getLang(chatId);

  try {
    await registerCandidate(chatId, candidateId, program);
    bot.sendMessage(chatId, lang.candidate_registration_success);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, lang.candidate_registration_error);
  }
});

bot.onText(/\/start_election/, async (msg) => {
  const chatId = msg.chat.id;
  const lang = await getLang(chatId);

  try {
    await startElection(chatId);
    bot.sendMessage(chatId, lang.election_started);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, lang.election_start_error);
  }
});
bot.onText(/\/impeach_president/, async (msg) => {
  const chatId = msg.chat.id;
  const lang = await getLang(chatId);

  try {
    await startImpeachmentProcess(chatId);
    bot.sendMessage(chatId, lang.president_impeachment_started);

    const impeachmentResult = await conductImpeachmentVote(chatId);
    if (impeachmentResult) {
      bot.sendMessage(chatId, lang.president_impeachment_success);
    } else {
      bot.sendMessage(chatId, lang.president_impeachment_failure);
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, lang.president_impeachment_error);
  }
});
async function startImpeachmentProcess(chatId, userId) {
  const lang = await getLang(chatId);

  if (!await isUserPresident(chatId, userId)) {
    bot.sendMessage(chatId, lang.impeachment_not_allowed);
    return;
  }

  const currentImpeachmentStatus = await getImpeachmentStatus(chatId);
  if (currentImpeachmentStatus) {
    bot.sendMessage(chatId, lang.impeachment_voting_ongoing);
    return;
  }

  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 1); // Задаем время окончания голосования через 1 час
  await startImpeachmentInDB(chatId, endTime);
}

async function conductImpeachmentVote(chatId) {
  const currentImpeachmentStatus = await getImpeachmentStatus(chatId);
  if (!currentImpeachmentStatus) {
    return false;
  }

  // Здесь вы можете добавить
  async function addImpeachmentVote(chatId, userId, vote) {
    // Здесь вы можете добавить логику для сохранения голоса пользователя в базе данных.
  }

  async function getImpeachmentVoteResults(chatId) {
    // Здесь вы можете добавить логику для получения результатов голосования по импичменту из базы данных.
    // Верните объект с количеством голосов "за" и "против".
  }

  async function conductImpeachmentVote(chatId) {
    const currentImpeachmentStatus = await getImpeachmentStatus(chatId);
    if (!currentImpeachmentStatus) {
      return false;
    }

    const now = new Date();
    const endTime = new Date(currentImpeachmentStatus.endTime);
    if (now >= endTime) {
      const results = await getImpeachmentVoteResults(chatId);
      const lang = await getLang(chatId);
      const requiredVotes = Math.ceil(currentImpeachmentStatus.totalUsers * 0.5); // Требуется 50% голосов для импичмента

      if (results.yes >= requiredVotes) {
        bot.sendMessage(chatId, lang.impeachment_successful);
        await updateImpeachmentStatusInDB(chatId, 'completed');
        // Здесь вы можете добавить логику для смены президента
      } else {
        bot.sendMessage(chatId, lang.impeachment_failed);
        await updateImpeachmentStatusInDB(chatId, 'completed');
      }
      return true;
    } else {
      return false;
    }
  }
  

