// src/clients/deepseekClient.ts
import OpenAI from 'openai';

const deepseek = new OpenAI({
    apiKey: (() => {
        if (!process.env.DEEPSEEK_API_KEY) {
            throw new Error("DEEEPISEEK_API_KEY is not defined in the environment variables.");
        }
        return process.env.DEEPSEEK_API_KEY;
    })(),
    baseURL: 'https://api.deepseek.com/v1',
});

export default deepseek;
