import Groq from "groq-sdk";

let client: Groq | null = null;

export function getGroqClient(): Groq {
  if (!client) {
    client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return client;
}

export async function callGroq(prompt: string): Promise<string> {
  const groq = getGroqClient();

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 4096,
    response_format: { type: "json_object" },
  });

  return response.choices[0]?.message?.content || "{}";
}
