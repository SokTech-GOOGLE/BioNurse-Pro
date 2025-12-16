
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL } from "../constants";

// Initialize Gemini Client inside the function to pick up environment variables dynamically
export const generateMedicalResponse = async (
  prompt: string, 
  history: string[] = []
): Promise<string> => {
  const geminiApiKey = process.env.GEMINI_API_KEY || ''; // Use GEMINI_API_KEY
  const openaiApiKey = process.env.OPENAI_API_KEY || '';  // Optional: if you also want OpenAI

  if (!geminiApiKey) {
    return "Configuration Error: Gemini API Key is missing. Please check your environment variables.";
  }

  const ai = new GoogleGenAI({ apiKey: geminiApiKey });

  try {
    // Construct a context-aware prompt
    const systemContext = `
      You are BioNurse Pro, an advanced AI medical assistant created by Akin S. Sokpah.
      Your goal is to provide helpful, accurate, and empathetic health information.
      
      Guidelines:
      1. Always clarify that you are an AI and not a replacement for a doctor.
      2. If symptoms sound severe (chest pain, trouble breathing, severe bleeding), advise the user to seek emergency care immediately.
      3. Be concise but thorough. Use formatting (bullet points) for readability.
      4. Maintain a professional, reassuring tone.
      
      Current Conversation Context:
      ${history.join('\n')}
    `;

    const fullPrompt = `${systemContext}\n\nUser Query: ${prompt}`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: fullPrompt,
    });

    return response.text || "I apologize, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to the medical database right now. Please try again later.";
  }
};
