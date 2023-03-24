const TelegramBot = require("node-telegram-bot-api");
const { TELEGRAM_BOT_TOKEN } = require("./config");
const { getLang, setLang, createOrUpdateUser } = require("./database");
const lang = require("./lang");
// index.js
const { pool, getUsers, getUserByChatId, createUser, updateUser, deleteUser, setLang } = require('./db');

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (!msg.text) {
    return;
  }

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
    await createOrUpdateUser(chatId);
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
