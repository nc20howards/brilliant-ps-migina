import { GoogleGenAI } from "@google/genai";

// In a real production app, this should be proxyed through a backend or careful env management.
// For this artifact, we assume process.env.API_KEY is injected by the runner.
const apiKey = process.env.API_KEY || '';

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey: apiKey });
}

export const GeminiService = {
  isAvailable: () => !!ai,

  draftPost: async (topic: string, category: string): Promise<string> => {
    if (!ai) throw new Error("AI Service not configured");

    try {
      const prompt = `
        You are an assistant for a school administrator.
        Draft a school announcement post.
        Topic: ${topic}
        Category: ${category}
        Tone: Professional, encouraging, and warm.
        Format: Pure text, suitable for a website content body. Keep it under 150 words.
        Do not include a title in the body, just the content.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text || "Could not generate draft.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
};
