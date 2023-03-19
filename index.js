const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const translations = require('./lang');

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

