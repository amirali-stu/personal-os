import { Bot, ChevronDown, Cpu, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

import { AIMessage, type AIMessageData } from "./AIMessage";

type Props = {
  messages: AIMessageData[];
  isThinking: boolean;
  model: string;
  onModelChange: (model: string) => void;
};

export function AIChat({ messages, isThinking, model, onModelChange }: Props) {
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = messagesRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isThinking]);

  return (
    <section className="flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      {/* Chat Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
            <Sparkles size={15} />
          </div>

          <div>
            <p className="text-[11px] font-bold text-white">گفتگوی جدید</p>

            <p className="mt-0.5 text-[9px] text-[var(--color-text-muted)]">
              آماده کمک به تو
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="flex h-8 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5">
            <Cpu size={13} className="text-[var(--color-primary)]" />

            <select
              value={model}
              onChange={(event) => onModelChange(event.target.value)}
              className="cursor-pointer appearance-none bg-transparent pl-5 text-[9px] font-medium text-[var(--color-text-secondary)] outline-none"
            >
              <option value="llama3.2">Llama 3.2</option>
            </select>

            <ChevronDown
              size={12}
              className="pointer-events-none absolute left-1.5 text-[var(--color-text-muted)]"
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesRef}
        className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-5"
      >
        {messages.length === 0 ? (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <div className="max-w-sm text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                <Bot size={25} />
              </div>

              <h2 className="mt-5 text-base font-bold text-white">
                چطور می‌تونم کمکت کنم؟
              </h2>

              <p className="mt-2 text-[11px] leading-6 text-[var(--color-text-muted)]">
                می‌تونی درباره کارهای روزانه، ترید، بازار یا هر بخش دیگری از
                Personal OS با من صحبت کنی.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <AIMessage key={message.id} message={message} />
            ))}

            {isThinking && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                  <Bot size={15} />
                </div>

                <div className="rounded-2xl rounded-tl-md border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-primary)]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-primary)] [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-primary)] [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
