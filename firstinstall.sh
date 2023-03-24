#!/bin/bash

# Обновление списка пакетов
sudo apt-get update

# Установка необходимых пакетов
sudo apt-get install -y curl git

# Установка Node.js и npm
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Настройка PostgreSQL
sudo -u postgres createuser --interactive
sudo -u postgres createdb dermocracy

# Клонирование вашего репозитория
git clone https://github.com/Dermocracy/dermocracy.git
cd dermocracy

# Установка зависимостей проекта
npm install

# Установка knex.js для работы с базой данных
npm install knex pg

# Инициализация knex.js
npx knex init

# Запрос токена Telegram и учетных данных базы данных
echo "Введите токен Telegram бота:"
read telegram_bot_token
echo "Введите имя пользователя базы данных:"
read db_user
echo "Введите пароль пользователя базы данных:"
read db_password

# Добавление файла .env с токеном вашего бота и настройками базы данных
echo "TELEGRAM_BOT_TOKEN=$telegram_bot_token" > .env
echo "DB_HOST=localhost" >> .env
echo "DB_USER=$db_user" >> .env
echo "DB_PASSWORD=$db_password" >> .env
echo "DB_NAME=dermocracy" >> .env

echo "Установка завершена. Вы можете запустить вашего бота командой 'node index.js' в папке 'dermocracy'."
