import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem } from "../types";

// Initialize the client
// Note: In a real production app, this would be proxied through a backend to protect the key.
// Since this is a frontend-only demo, we assume the env var is available or the user understands the risk.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getRecommendation = async (
  mood: string,
  menuItems: MenuItem[]
): Promise<{ recommendation: string; suggestedItemNames: string[] }> => {
  if (!process.env.API_KEY) {
    return {
      recommendation: "AI Service Unavailable (Missing API Key). Try our Caramel Macchiato!",
      suggestedItemNames: ["Caramel Macchiato"]
    };
  }

  try {
    const menuDescriptions = menuItems
      .map(item => `${item.name} (${item.category}): ${item.description}`)
      .join('\n');

    const prompt = `
      You are a friendly barista. The customer says: "${mood}".
      Based on the following menu, recommend 1-2 items that match their mood.
      
      Menu:
      ${menuDescriptions}
      
      Return a JSON object with a short friendly "message" and an array of "suggestedItemNames" (exact names from the menu).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            suggestedItemNames: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("AI Error:", error);
    return {
      recommendation: "I'm having trouble thinking right now, but coffee is always a good idea!",
      suggestedItemNames: []
    };
  }
};