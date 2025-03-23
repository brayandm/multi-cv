import { useCallback, useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea,
} from "@heroui/react";
import { Button } from "@heroui/react";
import {
  ChatBubbleLeftEllipsisIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import BotIcon from "@/shared/icons/BotIcon/BotIcon";
import { useChat } from "@/contexts/ChatContext";
import { useTranslations } from "next-intl";

export default function ChatComponent() {
  const { chat, addMessage, generateBotMessage } = useChat();

  const [input, setInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = useCallback(() => {
    if (!input.trim()) return;
    addMessage({ text: input, sender: "person" });
    setInput("");
  }, [input, addMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

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

  useEffect(() => {
    if (isChatOpen && chat) {
      if (chat.messages.length === 0) generateBotMessage();

      if (
        chat.messages.length > 0 &&
        chat.messages[chat.messages.length - 1].sender === "person"
      ) {
        generateBotMessage();
      }
    }
  }, [chat, generateBotMessage, isChatOpen]);

  const [startAnimation, setStartAnimation] = useState(false);

  const [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (chat) {
      setStartAnimation(true);
      setShowPopover(true);
      setTimeout(() => {
        setStartAnimation(false);
      }, 1000);
      timerId = setTimeout(() => {
        setStartAnimation(false);
        setShowPopover(false);
      }, 4000);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [chat]);

  const t = useTranslations();

  const content = (
    <PopoverContent>
      <div className="px-1 py-2">
        <div className="text-small font-bold">{t("common.texts.chat")}</div>
        <div className="text-tiny"> {t("common.texts.chat_description")} </div>
      </div>
    </PopoverContent>
  );

  return (
    <>
      {chat && (
        <>
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
              !isChatOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            onClick={() => setIsChatOpen(false)}
          />
          <div
            className={`fixed bottom-4 right-4 max-w-xs w-full bg-white shadow-lg rounded-3xl z-40 transition-opacity duration-300 ${
              !isChatOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <button
              className="absolute -top-7 -left-3 bg-primary-800 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
              onClick={() => setIsChatOpen(false)}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <div className="h-[35rem] flex flex-col rounded-3xl overflow-hidden">
              <div className="flex bg-primary-400 px-4 items-center space-x-3 border-b pb-3 pt-4 shadow-md">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <BotIcon className="w-6 h-6 text-primary-400" />
                </div>
                <h2 className="font-semibold text-white">AI Assistant</h2>
              </div>
              <div
                className={`h-full overflow-y-scroll overflow-x-hidden p-4 space-y-3`}
              >
                {chat.messages.map((msg, index) => (
                  <div key={index} className="flex flex-col items-start">
                    <div
                      className={`break-words text-small font-medium max-w-[90%] rounded-3xl p-3 ${
                        msg.sender === "bot"
                          ? "bg-secondary text-white self-start"
                          : "bg-primary text-white self-end"
                      } `}
                    >
                      {msg.isLoading ? (
                        <div className="flex space-x-1">
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
                <div ref={messagesEndRef} />
              </div>
              <div className="flex flex-row items-end px-4 pb-4 space-x-2 border-t-2 pt-3 shadow-lg">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  minRows={1}
                  maxRows={8}
                  placeholder="Type a message..."
                  className="flex-1"
                  classNames={{
                    inputWrapper: "rounded-3xl shadow-lg",
                  }}
                  isDisabled={chat.messages.length >= 7}
                />
                <Button
                  color={"primary"}
                  onPressStart={sendMessage}
                  className="p-2 rounded-full"
                  isIconOnly
                  isDisabled={
                    !input.trim() ||
                    chat.messages.some((m) => m.isLoading) ||
                    (chat.messages.length > 0 &&
                      chat.messages[chat.messages.length - 1].sender ===
                        "person")
                  }
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          <Popover
            color="secondary"
            placement={"top-end"}
            onChange={() => setIsChatOpen(true)}
            isOpen={showPopover}
            className="z-40"
            showArrow
            triggerScaleOnOpen={false}
            shouldCloseOnInteractOutside={() => {
              setShowPopover(false);
              return true;
            }}
          >
            <PopoverTrigger>
              <button
                className={`fixed bottom-6 right-6 bg-warning text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-opacity duration-300 ${
                  isChatOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                } ${startAnimation ? "animate-grow-shrink" : ""}`}
              >
                <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
              </button>
            </PopoverTrigger>
            {content}
          </Popover>
        </>
      )}
    </>
  );
}
