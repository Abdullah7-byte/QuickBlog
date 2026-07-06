import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const run = async () => {
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log("MONGODB_URI is not set in server/.env.");
    mongoUri = await askQuestion("Please enter your MongoDB connection string (URI): ");
  }

  if (!mongoUri || !mongoUri.trim()) {
    console.error("Error: MongoDB connection string is required.");
    rl.close();
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri.trim());
    console.log("Connected successfully!");

    const demoEmail = "demo.reader@quickblog.local";
    const demoPassword = "ReaderPassword123";

    // Check if user already exists
    const existingUser = await User.findOne({ email: demoEmail });
    if (existingUser) {
      console.log(`Demo user with email ${demoEmail} already exists in the database.`);
      await mongoose.connection.close();
      rl.close();
      return;
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(demoPassword, 10);

    // Create user
    console.log("Creating demo user...");
    await User.create({
      name: "Demo Reader",
      email: demoEmail,
      password: hashedPassword,
      isVerified: true,
    });

    console.log("\n=============================================");
    console.log("Success! Demo user has been created.");
    console.log("Credentials:");
    console.log(` - Email: ${demoEmail}`);
    console.log(` - Password: ${demoPassword}`);
    console.log("=============================================\n");

  } catch (error) {
    console.error("Error creating demo user:", error.message);
  } finally {
    await mongoose.connection.close();
    rl.close();
  }
};

run();
