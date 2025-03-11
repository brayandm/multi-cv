import { useCallback, useEffect, useState } from "react";
import { Textarea } from "@heroui/react";
import { Button } from "@heroui/react";
import {
  ChatBubbleLeftEllipsisIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";

interface Message {
  text: string;
  isBot: boolean;
  isLoading?: boolean;
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! How can I assist you today?", isBot: true },
    { text: "Can you help me with my account?", isBot: false },
    { text: "Of course! What issue are you experiencing?", isBot: true },
    { text: "I can't seem to log in.", isBot: false },
    { text: "", isBot: true, isLoading: true },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { text: input, isBot: false }]);
    setInput("");
  }, [input]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
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
    <div className="h-[35rem] flex flex-col fixed bottom-4 right-4 max-w-xs w-full bg-white shadow-lg rounded-3xl border z-50 overflow-hidden">
      <div className="flex px-4 items-center space-x-3 border-b pb-3 pt-4 shadow-md">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <ChatBubbleLeftEllipsisIcon className="w-6 h-6 text-white" />
        </div>
        <h2 className="font-semibold text-gray-800">Chat Assistant</h2>
      </div>
      <div className="h-full overflow-y-auto p-3 space-y-3">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col items-start">
            <div
              className={`text-small font-medium " ${
                msg.isBot
                  ? "bg-secondary text-white self-start"
                  : "bg-primary text-white self-end"
              } max-w-[80%] rounded-3xl p-3`}
            >
              {msg.isLoading ? (
                <div className="flex space-x-2">
                  <div
                    className="h-1.5 w-1.5 bg-white rounded-full animate-bounce-custom"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-1.5 w-1.5 bg-white rounded-full animate-bounce-custom"
                    style={{ animationDelay: "100ms" }}
                  ></div>
                  <div
                    className="h-1.5 w-1.5 bg-white rounded-full animate-bounce-custom"
                    style={{ animationDelay: "200ms" }}
                  ></div>
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row items-end px-4 pb-4 space-x-2 border-t pt-3 shadow-lg">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          minRows={1}
          maxRows={8}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button
          color={"primary"}
          onPress={sendMessage}
          isDisabled={!input.trim()}
          className="p-2"
          isIconOnly
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
