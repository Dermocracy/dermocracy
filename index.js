require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");
const lang = require("./lang");
const db = require('./db');
const { setLang, getLang } = require('./db');
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const { createOrUpdateUser } = require('./db');

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (!msg.text) {
    return;
  }

  // Создаем или обновляем пользователя перед получением языка

  await createOrUpdateUser(chatId, null);
  const userLang = await getLang(chatId);

  if (userLang === null) {
    showLanguageSelection(chatId);
  }
});

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

bot.on("callback_query", async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const langCode = callbackQuery.data;

  if (langCode === "en" || langCode === "ru") {
    await setLang(chatId, langCode);
    const userLang = lang[langCode];

    bot.sendMessage(chatId, userLang.greetings);
    bot.sendMessage(chatId, userLang.choose_action, {
      reply_markup: JSON.stringify({
        keyboard: [
          [{ text: userLang.vote_for_president }],
          [{ text: userLang.impeach_president }],
          [{ text: userLang.start_election }],
        ],
        resize_keyboard: true,
      }),
    });
  }
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  showLanguageSelection(chatId);
});

bot.onText(/\/vote_for_president/, async (msg) => {
  const chatId = msg.chat.id;
  const lang = await getLang(chatId);
  bot.sendMessage(chatId, lang.vote_for_president);
});

bot.onText(/\/impeach_president/, async (msg) => {
  const chatId = msg.chat.id;
  const lang = await getLang(chatId);
  bot.sendMessage(chatId, lang.impeach_president);
});

bot.onText(/\/start_election/, async (msg) => {
  const chatId = msg.chat.id;
  const lang = await getLang(chatId);
  bot.sendMessage(chatId, lang.start_election);
});

console.log("Dermocracy Bot запущен и ожидает сообщений...");
