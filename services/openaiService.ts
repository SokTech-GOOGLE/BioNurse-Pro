// OpenAI Integration
// Note: In a production environment, API calls should be routed through a backend 
// to protect the API key. For this Vercel deployment structure, we use the env variable.

export const generateOpenAIResponse = async (
  prompt: string, 
  history: { role: string; text: string }[] = []
): Promise<string> => {
  const apiKey = process.env.OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;

  if (!apiKey) {
    return "Configuration Error: OpenAI API Key is missing in environment variables.";
  }

  try {
    // Convert BioNurse history format to OpenAI format
    const messages = [
      {
        role: "system",
        content: `You are BioNurse Pro, an advanced AI medical assistant. 
        Your goal is to provide helpful, accurate, and empathetic health information.
        1. Clarify you are an AI, not a doctor.
        2. Advise emergency care for severe symptoms.
        3. Be concise and professional.`
      },
      ...history.map(msg => ({
        role: msg.role === 'model' ? 'assistant' : 'user',
        content: msg.text
      })),
      { role: "user", content: prompt }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // Using the latest efficient model
        messages: messages,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "OpenAI API Error");
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "No response generated.";

  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return `Error connecting to OpenAI: ${error.message}. Please check your API Key or quota.`;
  }
};
