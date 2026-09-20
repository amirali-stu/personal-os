import { useCallback, useState } from "react";

import type { AIMessageData } from "../components/AIMessage";
import { generateOllamaResponse } from "../services/ollamaService";

export function useAI() {
  const [isThinking, setIsThinking] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (messages: AIMessageData[], model: string) => {
      if (isThinking) {
        return null;
      }

      setError(null);
      setIsThinking(true);

      try {
        const response = await generateOllamaResponse(model, messages);

        return response;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "خطایی در ارتباط با هوش مصنوعی رخ داد.";

        setError(message);

        return null;
      } finally {
        setIsThinking(false);
      }
    },
    [isThinking],
  );

  return {
    isThinking,
    error,
    sendMessage,
  };
}
