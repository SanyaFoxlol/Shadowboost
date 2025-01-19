const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./users.db');

// Middleware для обработки JSON
app.use(bodyParser.json());

// Создание глобальной базы данных
// Создание таблицы пользователей
const createTablesSQL = `
CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS PasswordResets (
    reset_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    reset_token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Roles (
    role_id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS UserRoles (
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UserActivityLog (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    activity TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS UserSettings (
    user_id INTEGER PRIMARY KEY,
    language_preference TEXT DEFAULT 'en',
    notification_preferences TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
`;

db.serialize(() => {
  db.exec(createTablesSQL, (err) => {
    if (err) {
      console.error('Ошибка при создании таблиц:', err.message);
    } else {
      console.log('Таблицы успешно созданы.');
    }
  });
});

// Регистрация пользователя
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('Username, email, and password are required.');
  }

  try {
    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Сохраняем пользователя в базе данных
    db.run(
      `INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)`,
      [username, email, hashedPassword],
      (err) => {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).send('Username or email already exists.');
          }
          return res.status(500).send('Database error.');
        }
        res.status(201).send('User registered successfully.');
      }
    );
  } catch (err) {
    res.status(500).send('Server error.');
  }
});

// Вход пользователя
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  // Ищем пользователя в базе данных
  db.get(
    `SELECT * FROM Users WHERE username = ?`,
    [username],
    async (err, user) => {
      if (err) return res.status(500).send('Database error.');

      if (!user) {
        return res.status(404).send('User not found.');
      }

      // Сравниваем пароли
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).send('Invalid credentials.');
      }

      res.status(200).send('Login successful.');
    }
  );
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});