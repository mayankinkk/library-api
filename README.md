# Library API (Node + Express + MongoDB)

**Name:** _Add your name here_

## How to run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create your `.env` file from the example and add your MongoDB Atlas connection string:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `MONGO_URI` to your real connection string (replace `PASSWORD` and cluster details).
3. Start the server:
   ```bash
   node server.js
   ```
   The server runs on `http://localhost:5000` after connecting to MongoDB.

## Routes

| Method | Path | What it does |
|--------|------|--------------|
| GET | `/` | Check API is running |
| POST | `/api/books` | Add a new book |
| GET | `/api/books` | List all books (supports `?available=true`, `?author=...`, `?sort=year`) |
| GET | `/api/books/:id` | Get one book by id |
| PUT | `/api/books/:id` | Update a book by id |
| DELETE | `/api/books/:id` | Delete a book by id |

## Notes

- Keep `.env` private (it is in `.gitignore`).
- Use Postman to send requests with JSON body for POST/PUT.
- MongoDB Atlas must allow your IP (Network Access) and the database user/password in `MONGO_URI` must be correct.
