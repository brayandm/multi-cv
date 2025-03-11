import { useCallback, useEffect, useState } from "react";
import { Input } from "@heroui/react";
import { Button } from "@heroui/react";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/solid";

interface Message {
  text: string;
  isBot: boolean;
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today?", isBot: true },
    { text: "Can you help me with my account?", isBot: false },
    { text: "Of course! What issue are you experiencing?", isBot: true },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, isBot: false }]);
    setInput("");
  }, [input]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sendMessage]);

  return (
    <div className="fixed bottom-4 right-4 max-w-xs w-full p-4 bg-white shadow-lg rounded-3xl border z-50">
      <div className="flex items-center space-x-3 border-b pb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-gray-600" />
        </div>
        <h2 className="font-semibold text-gray-800">Chat Assistant</h2>
      </div>
      <div className="h-80 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col items-start">
            <div
              key={index}
              className={`text-small font-medium p-3 rounded-3xl w-5/6 ${
                msg.isBot
                  ? "bg-secondary text-white self-start"
                  : "bg-primary text-white self-end"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2 border-t pt-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button
          color={"primary"}
          onPress={sendMessage}
          isDisabled={!input.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
