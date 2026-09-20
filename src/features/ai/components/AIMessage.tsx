import { Bot, User } from "lucide-react";

export type AIMessageRole = "user" | "assistant";

export type AIMessageData = {
  id: number;
  role: AIMessageRole;
  content: string;
  time: string;
};

type Props = {
  message: AIMessageData;
};

export function AIMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          isUser
            ? "bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
            : "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
        }`}
      >
        {isUser ? <User size={15} /> : <Bot size={15} />}
      </div>

      <div
        className={`max-w-[85%] sm:max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        } flex flex-col`}
      >
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "rounded-tr-md bg-[var(--color-primary)] text-white"
              : "rounded-tl-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)]"
          }`}
        >
          <p className="whitespace-pre-wrap text-xs leading-6">
            {message.content}
          </p>
        </div>

        <span className="mt-1.5 px-1 text-[9px] text-[var(--color-text-muted)]">
          {message.time}
        </span>
      </div>
    </div>
  );
}
