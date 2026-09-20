import type { AIMessageData } from "../components/AIMessage";

const OLLAMA_BASE_URL = "http://localhost:11434";

export type OllamaModel = {
  name: string;
  model: string;
  size: number;
  modified_at: string;
};

type OllamaMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type OllamaChatResponse = {
  message?: {
    role: string;
    content: string;
  };
};

export async function checkOllamaConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);

    return response.ok;
  } catch {
    return false;
  }
}

export async function getOllamaModels(): Promise<OllamaModel[]> {
  const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);

  if (!response.ok) {
    throw new Error("امکان دریافت مدل‌های Ollama وجود ندارد.");
  }

  const data = await response.json();

  return data.models ?? [];
}

export async function generateOllamaResponse(
  model: string,
  messages: AIMessageData[],
): Promise<string> {
  const ollamaMessages: OllamaMessage[] = messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));

  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: ollamaMessages,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error("دریافت پاسخ از مدل هوش مصنوعی ناموفق بود.");
  }

  const data: OllamaChatResponse = await response.json();

  return data.message?.content?.trim() || "مدل پاسخی برنگرداند.";
}
