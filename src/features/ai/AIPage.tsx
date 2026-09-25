import { useState } from "react";

import { useSettingsStore } from "../../app/store/settingsStore";
import { useTrades } from "../trading/hooks/useTrades";

import { useAI } from "./hooks/useAiChat";
import { AIChat } from "./components/AIChat";
import { AIHeader } from "./components/AIHeader";
import { AIQuickActions } from "./components/AIQuickActions";
import { AIInput } from "./components/AIInput";
import type { AIMessageData } from "./components/AIMessage";

export function AIPage() {
  const [messages, setMessages] = useState<AIMessageData[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState("llama3.2");

  const { isThinking, sendMessage } = useAI();
  const { trades } = useTrades();
  const language = useSettingsStore((state) => state.language);
  const isRtl = language === "fa";

  async function handleSubmit() {
    const text = input.trim();

    if (!text || isThinking) {
      return;
    }

    const userMessage: AIMessageData = {
      id: Date.now(),
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString(isRtl ? "fa-IR" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    const response = await sendMessage(
      updatedMessages,
      model,
      trades,
      language === "fa" ? "fa" : "en",
    );

    if (!response) {
      return;
    }

    const assistantMessage: AIMessageData = {
      id: Date.now() + 1,
      role: "assistant",
      content: response,
      time: new Date().toLocaleTimeString(isRtl ? "fa-IR" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((current) => [...current, assistantMessage]);
  }

  function handleQuickAction(text: string) {
    setInput(text);
  }

  function handleClear() {
    setMessages([]);
    setInput("");
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="space-y-5">
      <AIHeader onClear={handleClear} />

      <AIChat
        messages={messages}
        isThinking={isThinking}
        model={model}
        onModelChange={setModel}
      />

      <AIQuickActions onSelect={handleQuickAction} />

      <AIInput
        value={input}
        disabled={isThinking}
        onChange={setInput}
        onSubmit={handleSubmit}
      />

      <div className="flex items-center justify-center gap-2 text-[9px] text-[var(--color-text-muted)]">
        <span>
          {isRtl
            ? "پاسخ‌ها بر اساس ژورنال ترید شما تولید می‌شوند"
            : "Responses are generated based on your trading journal"}
        </span>
      </div>
    </div>
  );
}
