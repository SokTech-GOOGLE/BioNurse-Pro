// services/aiAssistant.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // Vite env variable
});

export async function askAI(prompt: string, options?: { temperature?: number; maxTokens?: number }) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4.1-mini
      messages: [{ role: "user", content: prompt }],
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 500,
    });

    return response.choices[0].message?.content || "No response from AI.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Sorry, I couldn't process your request.";
  }
}
