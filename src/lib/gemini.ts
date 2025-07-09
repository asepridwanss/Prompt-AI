// src/clients/geminiClient.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI((() => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
    }
    return process.env.GEMINI_API_KEY;
})());

export default genAI;
