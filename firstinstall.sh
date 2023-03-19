#!/bin/bash

# Обновление списка пакетов
sudo apt-get update

# Установка необходимых пакетов
sudo apt-get install -y curl git

# Установка Node.js и npm
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Клонирование вашего репозитория
git clone https://github.com/Dermocracy/dermocracy.git
cd dermocracy

# Установка зависимостей проекта
npm install

# Добавление файла .env с токеном вашего бота
echo "TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN" > .env

echo "Установка завершена. Вы можете запустить вашего бота командой 'node index.js' в папке 'dermocracy'."
