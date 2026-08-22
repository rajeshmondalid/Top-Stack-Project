import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import Quote from "./models/Quote.js";
import authRoutes from "./routes/auth.js";
import { requireAuth } from "./middleware/auth.js";

const app = express();
const port = process.env.PORT || 5000;
let databaseConnection;

function connectDatabase() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quote_collector";
  if (!databaseConnection) {
    databaseConnection = mongoose.connect(mongoUri).catch((error) => {
      databaseConnection = null;
      throw error;
    });
  }
  return databaseConnection;
}

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (req.url === "/api") req.url = "/";
  if (req.url.startsWith("/api/")) req.url = req.url.slice(4);
  next();
});
app.get("/health", async (req, res) => {
  try {
    await connectDatabase();
    res.json({ connected: mongoose.connection.readyState === 1 });
  } catch (error) {
    const hasDatabaseUrl = Boolean(process.env.MONGO_URI || process.env.MONGODB_URI);
    res.status(503).json({ connected: false, message: hasDatabaseUrl ? "Atlas connection failed. Check Atlas Network Access and database credentials" : "MONGO_URI is missing in the deployment environment" });
  }
});
app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});
app.use("/auth", authRoutes);

app.get("/quotes", async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch quotes" });
  }
});

app.get("/quotes/:id", async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return res.status(404).json({ message: "Quote not found" });
    res.json(quote);
  } catch (error) {
    res.status(400).json({ message: "Invalid quote id" });
  }
});

app.post("/quotes", requireAuth, async (req, res) => {
  try {
    const quote = await Quote.create(req.body);
    res.status(201).json(quote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/quotes/:id", requireAuth, async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!quote) return res.status(404).json({ message: "Quote not found" });
    res.json(quote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/quotes/:id", requireAuth, async (req, res) => {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id);
    if (!quote) return res.status(404).json({ message: "Quote not found" });
    res.json({ message: "Quote deleted" });
  } catch (error) {
    res.status(400).json({ message: "Invalid quote id" });
  }
});

if (process.env.VERCEL !== "1") {
  app.listen(port, () => console.log(`API running on port ${port}`));
}

export default app;