
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export async function* streamGemini(model: string, contents: any, config: any): AsyncIterable<string> {
  // Always use a new GoogleGenAI instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const responseStream = await ai.models.generateContentStream({
      model: model,
      contents: contents,
      config: config,
    });

    for await (const chunk of responseStream) {
      // The GenerateContentResponse features a text property, not a method.
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    throw error;
  }
}
