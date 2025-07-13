import { GoogleGenAI } from "@google/genai";

interface LLMProvider {
  generateText(prompt: string, model: string): Promise<string | null> ;
}


export class GeminiProvider implements LLMProvider {

  private ai: GoogleGenAI;

  constructor() {
    // Automatically reads the GOOGLE_API_KEY from the environment variables.
    this.ai = new GoogleGenAI({});
  }

  async generateText(prompt: string, model: 'gemini-2.5-flash') {
    const response = await this.ai.models.generateContent({
      model,
      contents: prompt
    });

    if (response.text) {
      return response.text;
    }

    return null;
  }
}