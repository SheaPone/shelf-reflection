set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userId" serial PRIMARY KEY,
  "username" text UNIQUE NOT NULL,
  "hashedPassword" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT 'now()'
);

CREATE TABLE "reviews" (
  "reviewId" serial PRIMARY KEY,
  "userId" integer,
  "bookTitle" text NOT NULL,
  "author" text NOT NULL,
  "photoUrl" text NOT NULL,
  "rating" integer NOT NULL,
  "review" text NOT NULL,
  "updatedAt" timestamptz NOT NULL DEFAULT 'now()'
);

CREATE TABLE "books" (
  "bookId" serial PRIMARY KEY,
  "title" text NOT NULL,
  "author" text NOT NULL,
  "price" integer NOT NULL,
  "imageUrl" text NOT NULL,
  "bookSummary" text NOT NULL
);

CREATE TABLE "carts" (
  "cartId" serial PRIMARY KEY,
  "userId" integer NOT NULL,
  "bookIds" integer[],
  "createdAt" timestamptz NOT NULL DEFAULT 'now()'
);

ALTER TABLE "reviews" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "carts" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");
