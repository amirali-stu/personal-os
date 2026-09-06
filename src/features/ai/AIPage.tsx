export function AIPage() {
  return <div>AIPage</div>;
}

// import { Sparkles } from "lucide-react";
// import { useState } from "react";

// import { useAI } from "./hooks/useAI";

// import { AIChat } from "./components/AIChat";
// import { AIHeader } from "./components/AIHeader";
// import { AIQuickActions } from "./components/AIQuickActions";
// import { AIInput } from "./components/AIInput";
// import type { AIMessageData } from "./components/AIMessage";

// export function AIPage() {
//   const [messages, setMessages] = useState<AIMessageData[]>([]);

//   const [input, setInput] = useState("");

//   const [model, setModel] = useState("llama3.2");

//   const { isThinking, sendMessage } = useAI();

//   async function handleSubmit() {
//     const text = input.trim();

//     if (!text || isThinking) {
//       return;
//     }

//     const userMessage: AIMessageData = {
//       id: Date.now(),
//       role: "user",
//       content: text,
//       time: new Date().toLocaleTimeString("fa-IR", {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };

//     const updatedMessages = [...messages, userMessage];

//     setMessages(updatedMessages);
//     setInput("");

//     const response = await sendMessage(updatedMessages, model);

//     if (!response) {
//       return;
//     }

//     const assistantMessage: AIMessageData = {
//       id: Date.now() + 1,
//       role: "assistant",
//       content: response,
//       time: new Date().toLocaleTimeString("fa-IR", {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };

//     setMessages((current) => [...current, assistantMessage]);
//   }

//   function handleQuickAction(text: string) {
//     setInput(text);
//   }

//   function handleClear() {
//     setMessages([]);
//     setInput("");
//   }

//   return (
//     <div className="space-y-5">
//       <AIHeader onClear={handleClear} />

//       <AIChat
//         messages={messages}
//         isThinking={isThinking}
//         model={model}
//         onModelChange={setModel}
//       />

//       <AIQuickActions onSelect={handleQuickAction} />

//       <AIInput
//         value={input}
//         disabled={isThinking}
//         onChange={setInput}
//         onSubmit={handleSubmit}
//       />

//       <div className="flex items-center justify-center gap-2 text-[9px] text-[var(--color-text-muted)]">
//         <Sparkles size={11} />

//         <span>پاسخ‌های AI ممکن است نیاز به بررسی داشته باشند</span>
//       </div>
//     </div>
//   );
// }
