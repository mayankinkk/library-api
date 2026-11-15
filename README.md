# Library API (Node + Express + MongoDB)

**Author:** Mayank Sharma


## Overview

A small Library Book API built with Node.js, Express, and Mongoose (MongoDB Atlas). All code lives in a single `server.js` file. The server exposes 6 working URLs for CRUD operations on books, plus filtering, sorting, a request logger, and centralized error handling.

## How to run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create your `.env` file from the example and add your MongoDB Atlas connection string:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `MONGO_URI` to your real connection string. The URI must point to the `library` database:
   ```
   MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/library?retryWrites=true&w=majority
   ```

3. Start the server:
   ```bash
   node server.js
   ```
   The server prints `MongoDB connected` and then `Server running on http://localhost:5001` (or port 5000 if free). Use the printed port in all Postman URLs.

   > Note: Port 5000 may be occupied by macOS ControlCenter. The app defaults to `PORT=5001`; you can override with `PORT=5000 node server.js` if 5000 is free.

## Routes

| Method | Path | What it does |
|--------|------|--------------|
| GET | `/` | Check API is running |
| POST | `/api/books` | Add a new book (requires `title` and `author`) |
| GET | `/api/books` | List all books (supports `?available=true\|false`, `?author=...`, `?sort=year`) |
| GET | `/api/books/:id` | Get one book by id (200 / 404 / 400) |
| PUT | `/api/books/:id` | Update a book by id (200 / 404 / 400) |
| DELETE | `/api/books/:id` | Delete a book by id (204 / 404 / 400) |

## Postman Checklist (Final Check)

| # | Request | Body (JSON) | Expected status |
|---|---------|-------------|-----------------|
| 1 | GET `/` | — | 200 "Library API running" |
| 2 | POST `/api/books` | `{"title":"Harry Potter","author":"J.K. Rowling","year":1997}` | 201 book with `_id` |
| 3 | POST `/api/books` | `{"author":"Someone"}` | 400 title required |
| 4 | GET `/api/books` | — | 200 list of books |
| 5 | GET `/api/books/{real_id}` | — | 200 that book |
| 6 | GET `/api/books/000000000000000000000000` | — | 404 Book not found |
| 7 | PUT `/api/books/{real_id}` | `{"available":false}` | 200 book with `available:false` |
| 8 | GET `/api/books?available=true` | — | 200 only available books |
| 9 | DELETE `/api/books/{real_id}` | — | 204 empty |

For rows that need an id, copy a real `_id` from the GET `/api/books` response.

## Connect Postman ↔ Atlas

```
Postman (http://localhost:5001/api/books)
    → Node server (server.js)
    → Mongoose
    → MongoDB Atlas → Database: `library` → Collection: `books`
```

Postman talks to your local Node server; the server talks to Atlas via Mongoose. Books created in Postman appear in Atlas under **Database: `library` → Collection: `books` → Find**.

In Atlas, make sure:
- You are viewing the **`library`** database (not `sample_mflix`).
- **Network Access** allows your IP address.
- The database user/password in `MONGO_URI` matches your Atlas **Database Access** user.

## Project files

| File | Purpose |
|------|---------|
| `server.js` | Express server, Mongoose connection, Book model, all routes, logger, error handling |
| `package.json` | Project metadata and dependencies (express, mongoose, dotenv) |
| `package-lock.json` | Locked dependency versions |
| `.env.example` | Template for `.env` (safe to share) |
| `.env` | Your real MongoDB connection string (**do not commit**) |
| `.gitignore` | Excludes `node_modules` and `.env` |
| `README.md` | This file |

## Submission

Commit and push these files to GitHub (repo name: `library-api-db`):

```bash
git add server.js package.json package-lock.json .env.example README.md .gitignore screenshots/
git commit -m "Library API with MongoDB"
git push
```

Required screenshots in `screenshots/`:
- Postman request/response for final-check rows 2–9 (one screenshot each).
- MongoDB Atlas screenshot of `library` → `books` collection showing your documents.

Do **not** commit `.env` or `node_modules`.

## Notes

- Keep `.env` private (it is in `.gitignore`).
- Use Postman with **Body → raw → JSON** for POST/PUT requests.
- MongoDB assigns each book a unique `_id` automatically; you do not write it.
- After every code change, stop the server (`Ctrl + C`) and restart (`node server.js`).
