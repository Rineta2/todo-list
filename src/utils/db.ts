import mongoose from "mongoose";

const MONGO_DB_SERVER = process.env.MONGO_DB_SERVER as string;

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    await mongoose.connect(MONGO_DB_SERVER);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}
