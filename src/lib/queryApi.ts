// src/query.ts
import openai from './chatgpt';
import deepseek from './deepsek';
import genAI from './gemini';
import fs from 'fs';
import path from 'path';

// Baca pedoman dari file .txt
const pedomanPath = path.join(process.cwd(), 'public/pedoman-skripsi-fti-unibba-perbaris.txt');
const pedomanText = fs.readFileSync(pedomanPath, 'utf-8');

const query = async (prompt: string, id: string, model: string): Promise<string> => {
  try {
    const shouldUsePedomanText = prompt.startsWith('#USE_PEDOMAN_TXT');
    const cleanedPrompt = shouldUsePedomanText ? prompt.replace('#USE_PEDOMAN_TXT\n', '') : prompt;

    if (model.startsWith('gpt-')) {
      const response = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: 'system',
            content: `
Anda adalah Asisten Akademik Skripsi FTI UNIBBA.

Tugas Anda:
- Hanya menjawab pertanyaan yang berkaitan dengan penulisan skripsi mahasiswa FTI UNIBBA.
- Pertanyaan dari pengguna bisa berupa:
  - Permintaan penyesuaian teks dengan format: Peran, Instruksi, Contoh, Konteks, dan Teks
  - Pertanyaan umum seputar penulisan  yang jawabannya sudah ada di pedoman skripsi.
- Jika pengguna mengirim pertanyaan dengan format tersebut, anggap itu valid dan bantu sesuai instruksi.
- Jika pertanyaan relevan dengan skripsi, jawab sesuai dengan data pedoman yang ada.
- Jika pertanyaan tidak relevan dengan skripsi, jawab:
"Maaf, saya hanya dapat membantu hal yang berkaitan dengan penulisan skripsi FTI UNIBBA."

${shouldUsePedomanText ? `Berikut pedoman skripsi:\n${pedomanText}` : ''}
            `.trim(),
          },
          {
            role: 'user',
            content: cleanedPrompt,
          },
        ],
        temperature: 0.9,
        top_p: 1,
        max_tokens: 2000,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return response.choices[0].message.content || '';
    }

    if (model === 'deepseek-chat') {
      const response = await deepseek.chat.completions.create({
        model,
        messages: [
          { role: 'user', content: prompt },
          { role: 'assistant', content: 'You are Deepseek, a helpful assistant.' },
        ],
        temperature: 0.9,
        top_p: 1,
        max_tokens: 1000,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      return response.choices[0].message.content || '';
    }

    if (model === 'gemini-2.5-flash') {
      const geminiModel = genAI.getGenerativeModel({ model });
      const result = await geminiModel.generateContent([prompt]);
      const response = await result.response;
      return response.text();
    }

    throw new Error(`Model '${model}' tidak dikenali.`);
  } catch (err: unknown) {
    return `Gagal mendapatkan jawaban! (Error: ${err instanceof Error ? err.message : 'Unknown error'})`;
  }
};

export default query;
