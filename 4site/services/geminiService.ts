import { GoogleGenAI } from "@google/genai";
import { LoveLetterParams, BeautyCompliment } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateNextCompliment = async (count: number): Promise<string> => {
  if (!apiKey) {
    const fallbacks = [
      "Ты — мой самый лучший подарок судьбы.",
      "Твой голос успокаивает меня даже за тысячи километров.",
      "Я люблю то, как ты смеешься.",
      "С тобой каждый день — праздник.",
      "Ты делаешь меня лучше.",
      "Твоя улыбка освещает мой мир.",
      "Я скучаю по тебе каждую секунду."
    ];
    return fallbacks[count % fallbacks.length];
  }

  const prompt = `
    Напиши ОДНУ короткую, уникальную и очень трогательную причину, почему я люблю свою девушку (мы в отношениях на расстоянии).
    Это должна быть причина номер ${count + 1}.
    Только текст причины. Не пиши "Причина №...".
    Максимум 1-2 предложения.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || "Ты — моя вселенная.";
  } catch (error) {
    console.error("Gemini Compliment Error", error);
    return "Я люблю тебя больше всего на свете.";
  }
};

export const generateBeautyWord = async (): Promise<BeautyCompliment> => {
  if (!apiKey) {
    return { word: "Неотразимая", description: "Твоя красота затмевает звезды." };
  }

  const prompt = `
    Придумай ОДНО красивое прилагательное (комплимент девушке) и короткое (1 предложение) объяснение к нему.
    Верни ответ строго в формате JSON:
    { "word": "СЛОВО", "description": "объяснение" }
    Пример: { "word": "Сияющая", "description": "Твоя улыбка освещает даже самые темные дни." }
    Слова должны быть разнообразными (не только про внешность, но и про душу, характер).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    if (response.text) {
        return JSON.parse(response.text) as BeautyCompliment;
    }
    throw new Error("Empty response");
  } catch (e) {
    return { word: "Любимая", description: "Ты — лучшее, что случалось в моей жизни." };
  }
};

export const generateDistanceNote = async (topic?: string): Promise<string> => {
  if (!apiKey) return "Скоро мы встретимся, и я тебя крепко обниму.";
  
  const prompt = topic 
    ? `Напиши короткое (1-2 предложения) сообщение для девушки, которая далеко. Тема: ${topic}. Сделай это эмоциональным и личным.`
    : `Напиши короткое (1-2 предложения) успокаивающее и обнадеживающее сообщение для девушки, которая далеко. О том, что расстояние временно, а любовь вечна.`;
  
  try {
     const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || "Расстояние ничего не значит, когда кто-то значит так много.";
  } catch (e) {
    return "Ты всегда в моем сердце, где бы ты ни была.";
  }
};