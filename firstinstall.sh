#!/bin/bash

# Обновление системы и установка зависимостей
sudo apt update
sudo apt install -y curl git

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PostgreSQL и его компонентов
sudo apt install -y postgresql postgresql-contrib

# Создание пользователя PostgreSQL с паролем
echo "Enter the new PostgreSQL user:"
read NEW_PG_USER
echo "Enter the new PostgreSQL user's password:"
read NEW_PG_PASSWORD
sudo -u postgres psql -c "CREATE USER $NEW_PG_USER WITH PASSWORD '$NEW_PG_PASSWORD';"

# Создание базы данных
sudo -u postgres createdb dermocracy

# Клонирование репозитория
git clone https://github.com/username/dermocracy.git

# Установка зависимостей проекта
cd dermocracy
npm install

# Создание и обновление файла knexfile.js с учетными данными пользователя базы данных
cat > knexfile.js << EOF
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: '$NEW_PG_USER',
      password: '$NEW_PG_PASSWORD',
      database: 'dermocracy'
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  }
};
EOF

# Запуск миграций базы данных
npm run knex -- migrate:latest

# Установка зависимостей для бота
npm install node-telegram-bot-api

# Запрос токена бота для Telegram
echo "Enter your bot token for Telegram:"
read BOT_TOKEN

# Создание .env файла с токеном бота и учетными данными базы данных
cat > .env << EOF
TELEGRAM_TOKEN=$BOT_TOKEN
DATABASE_URL=postgres://$NEW_PG_USER:$NEW_PG_PASSWORD@localhost/dermocracy
EOF

echo "Установка завершена. Вы можете запустить вашего бота командой 'node index.js' в папке 'dermocracy'."
