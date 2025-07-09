// src/query.ts
import openai from './chatgpt';
import deepseek from './deepsek';
import genAI from './gemini';

const query = async (prompt: string, id: string, model: string): Promise<string> => {
  
  try {
    if (model.startsWith("gpt-")) {
      // OpenAI
      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: "user", content: prompt },
           { role: "assistant", content: "You are ChatGPT, a helpful assistant." },
        ],
        temperature: 0.9,
        top_p: 1,
        max_tokens: 1000,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      return response.choices[0].message.content || '';
    } else if (model === "deepseek-chat") {
      // DeepSeek
      const response = await deepseek.chat.completions.create({
        model,
        messages: [
          { role: "user", content: prompt },
           { role: "assistant", content: "You are Deepseek, a helpful assistant." },
        ],
        temperature: 0.9,
        top_p: 1,
        max_tokens: 1000,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      return response.choices[0].message.content || '';
    } else if (model === "gemini-2.5-flash") {
      // Gemini
      const geminiModel = genAI.getGenerativeModel({ model });
      const result = await geminiModel.generateContent([
        
        prompt,
      ]);
      const response = await result.response;
      return response.text();
    } else {
      throw new Error(`Model '${model}' tidak dikenali.`);
    }
  }
  //@typescript-eslint/no-explicit-any
  catch (err: unknown) {
    return `Gagal mendapatkan jawaban! (Error: ${err instanceof Error ? err.message : 'Unknown error'})`;
  }
};

export default query;
