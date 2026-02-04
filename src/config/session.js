import session from 'express-session';
import { createRequire } from 'module';
import dotenv from 'dotenv';

const require = createRequire(import.meta.url);
const MySQLStore = require('express-mysql-session')(session);

dotenv.config();

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  clearExpired: true,
  checkExpirationInterval: 900000, // 15 min
  expiration: 86400000 // 1 day
});

const sessionConfig = session({
  name: 'whatsapp_session',
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  proxy: true, // 🔥 REQUIRED for cPanel
  cookie: {
    secure: false,        // 🔥 MUST be false on cPanel
    httpOnly: true,
    sameSite: 'lax',      // 🔥 NOT strict
    maxAge: 24 * 60 * 60 * 1000
  }
});

export default sessionConfig;
