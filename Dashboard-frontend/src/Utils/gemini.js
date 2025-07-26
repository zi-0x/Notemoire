import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Generates AI content based on a prompt
export async function generateAIContent(prompt) {
  try {
    const model = genAI.getGenerativeModel({  model: "gemini-2.5-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Gemini API Error (generate):", error.message);
    throw error;
  }
}


