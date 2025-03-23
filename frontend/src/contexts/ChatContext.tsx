"use client";

import { chatExperienceEngine } from "@/lib/backendService";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
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
  chat: ChatData | null;
  setChat: (selector: ChatSelector | null) => void;
  addMessage: (msg: ChatMessage) => void;
  generateBotMessage: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const SESSION_KEY = "chatMap";

const getKey = ({ type, id }: ChatSelector): string =>
  id ? `${type}:${id}` : type;

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatMap, setChatMap] = useState<ChatMap>({});
  const [currentType, setCurrentType] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | undefined>(undefined);

  const currentKey = useMemo(() => {
    if (!currentType) return null;
    return getKey({ type: currentType, id: currentId });
  }, [currentType, currentId]);

  const chat = useMemo<ChatData | null>(() => {
    if (!currentKey) return null;
    return chatMap[currentKey] || { messages: [] };
  }, [chatMap, currentKey]);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed: ChatMap = JSON.parse(stored);
        setChatMap(parsed);
      } catch {
        console.warn("Invalid chatMap in sessionStorage");
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(chatMap));
  }, [chatMap]);

  const setChat = (selector: ChatSelector | null) => {
    if (!selector) {
      setCurrentType(null);
      setCurrentId(undefined);
      return;
    }
    const { type, id } = selector;
    setCurrentType(type);
    setCurrentId(id);
    const key = getKey({ type, id });
    setChatMap((prev) => ({
      ...prev,
      [key]: prev[key] || { messages: [] },
    }));
  };

  const addMessage = (msg: ChatMessage) => {
    if (!currentType) return;
    const key = getKey({ type: currentType, id: currentId });
    setChatMap((prev) => ({
      ...prev,
      [key]: {
        messages: [...(prev[key]?.messages || []), msg],
      },
    }));
  };

  const getMessage = async (
    currentType: string | null,
    currentId: string | undefined
  ) => {
    try {
      if (currentType === "experience" && currentId) {
        const response = await chatExperienceEngine({
          experience_id: currentId,
          chat: chatMap[getKey({ type: currentType, id: currentId })] || {
            messages: [],
          },
        });
        return response.data.message;
      }
    } catch (error) {
      console.error("Failed to fetch bot message:", error);
    }
  };

  const generateBotMessage = async () => {
    if (!currentType) return;
    const key = getKey({ type: currentType, id: currentId });

    const loadingMessage: ChatMessage = {
      sender: "bot",
      text: "",
      isLoading: true,
    };

    setChatMap((prev) => ({
      ...prev,
      [key]: {
        messages: [...(prev[key]?.messages || []), loadingMessage],
      },
    }));

    try {
      const message = await getMessage(currentType, currentId);
      if (!message) throw new Error("No message received from bot");

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
