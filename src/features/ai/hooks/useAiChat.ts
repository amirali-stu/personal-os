import { useCallback, useState } from "react";

import type { AIMessageData } from "../components/AIMessage";
import { generateOllamaResponse } from "../services/ollamaService";
import { buildJournalSummary, buildSystemPrompt } from "../services/journalContext";
import type { Trade } from "../../trading/types";

export function useAI() {
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (
      messages: AIMessageData[],
      model: string,
      trades: Trade[] = [],
      language: "fa" | "en" = "fa",
    ) => {
      if (isThinking) {
        return null;
      }

      setError(null);
      setIsThinking(true);

      try {
        const journalSummary = buildJournalSummary(trades);
        const systemPrompt = buildSystemPrompt(journalSummary, language);

        // پیام سیستم را به اول مکالمه اضافه می‌کنیم
        const messagesWithContext: AIMessageData[] = [
          {
            id: 0,
            role: "assistant", // Ollama system را به صورت پیام اول می‌فرستیم
            content: systemPrompt,
            time: "",
          },
          ...messages,
        ];

        const response = await generateOllamaResponse(model, messagesWithContext);

        return response;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
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