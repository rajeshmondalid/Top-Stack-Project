import mongoose from "mongoose";
import dotenv from "dotenv";
import Quote from "./models/Quote.js";

dotenv.config();

const mongoUri = (process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quote_collector").trim().replace(/^['"]|['"]$/g, "");

const seedQuotes = [
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: "Inspiration" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln", category: "Life" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "Life" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "Philosophy" },
  { text: "Get busy living or get busy dying.", author: "Stephen King", category: "Motivation" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West", category: "Life" },
  { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas A. Edison", category: "Success" },
  { text: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein", category: "Goals" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth", category: "Sports" },
  { text: "Money and success don't change people; they merely amplify what is already there.", author: "Will Smith", category: "Success" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", category: "Life" },
  { text: "Not how long, but how well you have lived is the main thing.", author: "Seneca", category: "Philosophy" },
  { text: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt", category: "Life" },
  { text: "The whole secret of a successful life is to find out what is one's destiny to do, and then do it.", author: "Henry Ford", category: "Success" },
  { text: "In order to write about life first you must live it.", author: "Ernest Hemingway", category: "Writing" },
  { text: "The big lesson in life, baby, is never be scared of anyone or anything.", author: "Frank Sinatra", category: "Courage" },
  { text: "Curiosity about life in all of its aspects, I think, is still the secret of great creative people.", author: "Leo Burnett", category: "Creativity" },
  { text: "Life is not a problem to be solved, but a reality to be experienced.", author: "Soren Kierkegaard", category: "Philosophy" },
  { text: "The unexamined life is not worth living.", author: "Socrates", category: "Philosophy" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey", category: "Wisdom" }
];

async function runSeed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected. Seeding quotes...");
    
    // Optional: clear existing quotes or just append
    // await Quote.deleteMany({});
    // console.log("Cleared old quotes.");

    await Quote.insertMany(seedQuotes);
    console.log(`Successfully added ${seedQuotes.length} quotes.`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding quotes:", err);
    process.exit(1);
  }
}

runSeed();
