import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, min: 1000 },
  available: { type: Boolean, default: true }
});

const Book = mongoose.model("Book", bookSchema);

app.get("/", (req, res) => {
  res.send("Library API running");
});

app.post("/api/books", async (req, res, next) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
});

app.get("/api/books", async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.available) {
      filter.available = req.query.available === "true";
    }
    if (req.query.author) {
      filter.author = { $regex: req.query.author, $options: "i" };
    }
    const books = await Book.find(filter).sort(
      req.query.sort === "year" ? { year: 1 } : {}
    );
    res.json(books);
  } catch (err) {
    next(err);
  }
});

app.get("/api/books/:id", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
});

app.put("/api/books/:id", async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    next(err);
  }
});

app.delete("/api/books/:id", async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const status =
    err.name === "ValidationError" || err.name === "CastError" ? 400 : 500;
  res.status(status).json({ message: err.message });
});

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.log("Database error:", err.message));
