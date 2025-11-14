import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY, GEMINI_MODEL } from "../config.js";
import { parseJsonFromText } from "../utils/parsers.js";

let genAI = null;

if (GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
}

export function isGeminiAvailable() {
  return genAI !== null;
}

export async function generateContent(prompt) {
  if (!genAI) {
    throw new Error("Gemini API key not configured.");
  }

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      temperature: 0.7,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response?.text();
  
  if (!text) {
    throw new Error("Empty response from Gemini model.");
  }

  return parseJsonFromText(text);
}

