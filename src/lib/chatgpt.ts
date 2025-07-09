import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: (() => {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not defined in the environment variables.");
    }
    return process.env.OPENAI_API_KEY;
  })(),
});
export default openai;
