import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: "../server/.env" });

console.log("GEMINI_API_KEY exists in server/.env:", !!process.env.GEMINI_API_KEY);
console.log("GEMINI_API_KEY in current process.env:", !!process.env.GEMINI_API_KEY);

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log("No API key available, using dummy_key to initialize to check if constructor throws...");
}

try {
  const genAI = new GoogleGenerativeAI(apiKey || "dummy_key");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log("Model initialized successfully.");
  
  if (apiKey) {
    console.log("Attempting generation...");
    const result = await model.generateContent("Say hello!");
    console.log("Generation output:", result.response.text());
  }
} catch (error) {
  console.error("Error encountered:", error);
}
