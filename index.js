require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");
const lang = require("./lang");
const db = require('./db');
const { setLang, getLang, createOrUpdateUser} = require('./db');
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Helper functions
function showLanguageSelection(chatId) {
  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "English 🇺🇸", callback_data: "en" }],
        [{ text: "Русский 🇷🇺", callback_data: "ru" }],
      ],
    }),
  };

  bot.sendMessage(chatId, "Please choose your language / Пожалуйста, выберите ваш язык", options);
}

function showActionsKeyboard(chatId, userLang) {
  bot.sendMessage(chatId, userLang.choose_action, {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: userLang.vote_for_president }],
        [{ text: userLang.impeach_president }],
        [{ text: userLang.start_election }],
        [{ text: userLang.register_candidate }],
        [{ text: userLang.view_candidates }],
      ],
      resize_keyboard: true,
    }),
  });
}

function isRegistrationPeriod() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const nextMonth = (currentMonth + 1) % 12;
  const registrationStartDate = new Date(now.getFullYear(), nextMonth, 1);
  registrationStartDate.setDate(registrationStartDate.getDate() - 2);

  return now >= registrationStartDate;
}

async function registerCandidate(chatId, userLang) {
  try {
    if (!isRegistrationPeriod()) {
      bot.sendMessage(chatId, userLang.registration_closed);
      return;
    }

    // Регистрация кандидата (здесь нужно использовать функцию из файла db.js)
    // Например: await registerCandidateInDB(chatId);

    bot.sendMessage(chatId, userLang.registration_successful);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, userLang.error_occurred);
  }
}
async function startElection(chatId, userLang) {
  try {
    const lang = await getLang(chatId);
    const currentDate = new Date();
    const electionDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1, 0, 0, 0, 0);
    const timeToElection = electionDate.getTime() - currentDate.getTime();

    if (timeToElection > 0 && timeToElection <= 48 * 60 * 60 * 1000) {
      // Запустить выборы
      await db.startElection();
      bot.sendMessage(chatId, userLang.election_started);
    } else {
      bot.sendMessage(chatId, userLang.election_start_error);
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, userLang.error_occurred);
  }
}

async function showCandidateList(chatId, userLang) {
  try {
    const candidates = await db.getCandidates();
    let candidateListMessage = userLang.candidate_list;

    if (candidates.length > 0) {
      candidates.forEach((candidate, index) => {
        candidateListMessage += `\n${index + 1}. ${candidate.name} (ID: ${candidate.chat_id})`;
      });
    } else {
      candidateListMessage = userLang.no_candidates;
    }

    bot.sendMessage(chatId, candidateListMessage);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, userLang.error_occurred);
  }
}


async function voteForCandidate(chatId, candidateId) {
  const userLang = await getLang(chatId);
  const success = await db.voteForCandidate(chatId, candidateId);

  if (success) {
    bot.sendMessage(chatId, userLang.vote_success);
  } else {
    bot.sendMessage(chatId, userLang.vote_error);
  }
}

// Bot event handlers
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (!msg.text) {
    return;
  }

  try {
    const user = await createOrUpdateUser(chatId);
    const userLang = await getLang(chatId);

    if (user.isNewUser) {
      showLanguageSelection(chatId);
    } else {
      showActionsKeyboard(chatId, userLang);
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, lang.en.error_occurred);
  }
});

bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const langCode = callbackQuery.data;

  if (langCode === "en" || langCode === "ru") {
    await setLang(chatId, langCode);
    const userLang = lang[langCode];

    showActionsKeyboard(chatId, userLang);
  }
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  showLanguageSelection(chatId);
});

bot.onText(/\/vote_for_president/, async (msg) => {
  const chatId = msg.chat.id;
  const userLang = await getLang(chatId);
  showActionsKeyboard(chatId, userLang);
});

bot.onText(/\/impeach_president/, async (msg) => {
  const chatId = msg.chat.id;
  const userLang = await getLang(chatId);
  showActionsKeyboard(chatId, userLang);
});

bot.onText(/\/start_election/, async (msg) => {
  const chatId = msg.chat.id;
  const userLang = await getLang(chatId);
  await startElection(chatId, userLang);
});

bot.onText(/\/vote (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const candidateId = parseInt(match[1]);

  voteForCandidate(chatId, candidateId);
});

bot.onText(/\/register_candidate/, async (msg) => {
  const chatId = msg.chat.id;
  const userLang = await getLang(chatId);
  await registerCandidate(chatId, userLang);
});

bot.onText(/\/view_candidates/, async (msg) => {
  const chatId = msg.chat.id;
  showCandidateList(chatId);
});

bot.onText(/\/vote_for_candidate/, async (msg) => {
  const chatId = msg.chat.id;
  const userLang = await getLang(chatId);
  showActionsKeyboard(chatId, userLang);
});

console.log("Dermocracy Bot is running and waiting for messages...");
