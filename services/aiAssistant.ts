// services/aiAssistant.ts
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Server-only environment variable
});

export interface AskAIOptions {
  temperature?: number;
  maxTokens?: number;
}

export async function askAI(prompt: string, options?: AskAIOptions): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or "gpt-4.1-mini"
      messages: [{ role: "user", content: prompt }],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 500,
    });

    return response.choices[0].message?.content ?? "No response from AI.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Sorry, I couldn't process your request.";
  }
}
