const TelegramBot = require('node-telegram-bot-api');
const { pool } = require('./database');
const {
  setLanguage,
  getLang,
  startElection,
  getCandidates,
  addCandidate,
  removeCandidate,
} = require('./lang');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log('Dermocracy Bot запущен и ожидает сообщений...');

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const lang = await getLang(chatId);

  if (msg.text.toString().toLowerCase() === '/start') {
    bot.sendMessage(chatId, lang.greetings, {
      reply_markup: {
        keyboard: lang.languages_keyboard,
        one_time_keyboard: true,
      },
    });
  }
});

bot.onText(/\/set_language_(\w+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const language = match[1];
  await setLanguage(chatId, language);
  const lang = await getLang(chatId);
  bot.sendMessage(chatId, lang.language_set);
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

bot.onText(/\/add_candidate (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const candidateName = match[1];
  const lang = await getLang(chatId);

  try {
    await addCandidate(chatId, candidateName);
    bot.sendMessage(chatId, lang.candidate_added(candidateName));
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, lang.candidate_add_error);
  }
});

bot.onText(/\/remove_candidate (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const candidateName = match[1];
  const lang = await getLang(chatId);

  try {
    await removeCandidate(chatId, candidateName);
    bot.sendMessage(chatId, lang.candidate_removed(candidateName));
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, lang.candidate_remove_error);
  }
});

bot.onText(/\/impeach_president/, async (msg) => {
  const chatId = msg.chat.id;
  const lang = await getLang(chatId);

  try {
    // здесь можно начать процесс импичмента
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, lang.impeachment_error);
  }
});
