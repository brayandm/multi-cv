"use client";

import { chatExperienceEngine } from "@/lib/backendService";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
} from "react";

export type Sender = "bot" | "person";

export interface ChatMessage {
  sender: Sender;
  text: string;
  isLoading?: boolean;
}

export interface ChatSelector {
  type: string;
  id?: string;
}

export interface ChatData {
  messages: ChatMessage[];
}

export type ChatMap = Record<string, ChatData>;

interface ChatContextType {
  chat: ChatData;
  setChat: (selector: ChatSelector) => void;
  addMessage: (msg: ChatMessage) => void;
  generateBotMessage: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const getKey = ({ type, id }: ChatSelector): string =>
  id ? `${type}:${id}` : type;

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatMap, setChatMap] = useState<ChatMap>({});
  const [currentType, setCurrentType] = useState<string>("");
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);

  const currentKey = useMemo(
    () => getKey({ type: currentType, id: currentId }),
    [currentType, currentId]
  );

  const chat = useMemo<ChatData>(() => {
    return chatMap[currentKey] || { messages: [] };
  }, [chatMap, currentKey]);

  const setChat = ({ type, id }: ChatSelector) => {
    setCurrentType(type);
    setCurrentId(id);
    const key = getKey({ type, id });
    setChatMap((prev) => ({
      ...prev,
      [key]: prev[key] || { messages: [] },
    }));
  };

  const addMessage = (msg: ChatMessage) => {
    const key = getKey({ type: currentType, id: currentId });
    setChatMap((prev) => ({
      ...prev,
      [key]: {
        messages: [...(prev[key]?.messages || []), msg],
      },
    }));
  };

  const getMessage = async (
    currentType: string,
    currentId: string | undefined
  ) => {
    try {
      if (currentType === "experience" && currentId) {
        return (
          await chatExperienceEngine({
            experience_id: currentId,
            chat: chatMap[currentKey] || { messages: [] },
          })
        ).data.message;
      }
    } catch (error) {
      console.error("Failed to fetch bot message:", error);
    }
  };

  const generateBotMessage = async () => {
    const loadingMessage: ChatMessage = {
      sender: "bot",
      text: "",
      isLoading: true,
    };

    const key = getKey({ type: currentType, id: currentId });

    setChatMap((prev) => ({
      ...prev,
      [key]: {
        messages: [...(prev[key]?.messages || []), loadingMessage],
      },
    }));

    try {
      const message = await getMessage(currentType, currentId);

      if (!message) {
        throw new Error("No message received from bot");
      }

      const botResponse: ChatMessage = {
        sender: "bot",
        text: message,
      };

      setChatMap((prev) => {
        const messages = [...(prev[key]?.messages || [])];
        const lastIndex = messages.findIndex((m) => m.isLoading);
        if (lastIndex !== -1) {
          messages[lastIndex] = botResponse;
        }
        return {
          ...prev,
          [key]: { messages },
        };
      });
    } catch (error) {
      console.error("Failed to fetch bot message:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{ chat, setChat, addMessage, generateBotMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
