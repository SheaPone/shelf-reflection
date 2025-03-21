/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { ClientError, errorMiddleware } from './lib/index.js';

type Auth = {
  username: string;
  password: string;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

app.use(express.json());

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
    insert into "users" ("username", "hashedPassword")
    values ($1, $2)
    returning "userId", "username", "createdAt";
    `;
    const params = [username, hashedPassword];
    const result = await db.query<Auth>(sql, params);
    const newUser = result.rows[0];
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }
    const sql = `
select "userId",
        "hashedPassword"
from "users"
where "username" = $1;
`;
    const params = [username];
    const result = await db.query(sql, params);
    const user = result.rows[0];
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const isPasswordValid = await argon2.verify(user.hashedPassword, password);
    if (!isPasswordValid) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = {
      userId: user.userId,
      username: user.username,
    };
    const newSignedToken = jwt.sign(payload, hashKey);
    res.status(200).json({
      user: payload,
      token: newSignedToken,
    });
  } catch (err) {
    next(err);
  }
});

// // Create paths for static directories
// const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
// const uploadsStaticDir = new URL('public', import.meta.url).pathname;

// app.use(express.static(reactStaticDir));
// // Static directory for file uploads server/public/
// app.use(express.static(uploadsStaticDir));

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
// app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
