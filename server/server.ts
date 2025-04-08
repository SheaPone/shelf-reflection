/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { authMiddleware, ClientError, errorMiddleware } from './lib/index.js';

type Review = {
  reviewId?: number;
  bookTitle: string;
  author: string;
  photoUrl: string;
  rating: number;
  review: string;
};

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

app.get('/api/reviews', authMiddleware, async (req, res, next) => {
  try {
    const sql = `
  select * from "reviews"
  where "userId" = $1
  order by "reviewId" desc;
  `;
    const params = [req.user?.userId];
    const result = await db.query(sql, params);
    const total = result.rows;
    if (!total) {
      throw new ClientError(404, `reviews not found`);
    }
    res.json(total);
  } catch (err) {
    next(err);
  }
});

app.get('/api/reviews/:reviewId', authMiddleware, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    if (reviewId === undefined) {
      throw new ClientError(400, `reviewId required`);
    }
    const sql = `
    select * from "reviews"
    where "reviewId" = $1 and "userId" =$2;
    `;
    const params = [reviewId, req.user?.userId];
    const result = await db.query<Review>(sql, params);
    const review = result.rows[0];
    if (!review) {
      throw new ClientError(404, `review ${reviewId} not found`);
    }
    res.json(review);
  } catch (err) {
    next(err);
  }
});

app.post('/api/reviews', authMiddleware, async (req, res, next) => {
  try {
    const { bookTitle, author, photoUrl, rating, review } = req.body;
    if (!bookTitle || !author || !photoUrl || !rating || !review) {
      throw new ClientError(
        400,
        `bookTitle, author, photoUrl, rating, and review are required`
      );
    }
    const sql = `
  insert into "reviews" ("bookTitle", "author", "photoUrl", "rating", "review", "userId")
  values ($1, $2, $3, $4, $5, $6)
  returning *;
  `;
    const params = [
      bookTitle,
      author,
      photoUrl,
      rating,
      review,
      req.user?.userId,
    ];
    const result = await db.query(sql, params);
    const newReview = result.rows[0];
    res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
});

app.put('/api/reviews/:reviewId', authMiddleware, async (req, res, next) => {
  try {
    const reviewId = Number(req.params.reviewId);
    if (!Number.isInteger(reviewId) || reviewId < 1) {
      throw new ClientError(400, 'reviewId must be a positive integer');
    }
    const { bookTitle, author, photoUrl, rating, review } = req.body;
    const sql = `
    update "reviews"
      set "updatedAt" = now(),
          "bookTitle" = $1,
          "author" = $2,
          "photoUrl" = $3,
          "rating" = $4,
          "review" = $5
    where "reviewId" = $6 and "userId" = $7
    returning *;
    `;
    const params = [
      bookTitle,
      author,
      photoUrl,
      rating,
      review,
      reviewId,
      req.user?.userId,
    ];
    const result = await db.query(sql, params);
    const updatedReview = result.rows[0];
    if (!updatedReview) {
      throw new ClientError(400, `cannot find review of review Id ${reviewId}`);
    }
    res.json(updatedReview);
  } catch (err) {
    next(err);
  }
});


app.get('/api/books', authMiddleware, async (req, res, next) => {
  const API_KEY = process.env.API_KEY;
  console.log(API_KEY);
  const query = req.query.q;
  console.log('query', query);
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Missing query parameter "q"' });
  }
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&maxResults=10&key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }
    console.log(response);
    const data = await response.json();
    res.json(data);
    console.log(data);
  } catch (err) {
    console.error(err);

app.delete('/api/reviews/:reviewId', authMiddleware, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    if (!Number.isInteger(+reviewId)) {
      throw new ClientError(400, `Non-integer reviewId: ${reviewId}`);
    }
    const deleteReviewSql = `
    delete from "reviews"
    where "reviewId" = $1
    returning *;
    `;
    const params = [reviewId];
    const result = await db.query(deleteReviewSql, params);
    const [review] = result.rows;
    if (!review) throw new ClientError(404, `review ${reviewId} not found`);
    res.status(204).json(review);
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
