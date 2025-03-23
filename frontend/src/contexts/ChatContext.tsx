"use client";

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
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const getKey = ({ type, id }: ChatSelector): string =>
  id ? `${type}:${id}` : type;

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chatMap, setChatMap] = useState<ChatMap>({});
  const [currentKey, setCurrentKey] = useState<string>("");

  const chat = useMemo<ChatData>(() => {
    return chatMap[currentKey] || { messages: [] };
  }, [chatMap, currentKey]);

  const setChat = (selector: ChatSelector) => {
    const key = getKey(selector);
    setCurrentKey(key);
    setChatMap((prev) => ({
      ...prev,
      [key]: prev[key] || { messages: [] },
    }));
  };

  const addMessage = (msg: ChatMessage) => {
    setChatMap((prev) => ({
      ...prev,
      [currentKey]: {
        messages: [...(prev[currentKey]?.messages || []), msg],
      },
    }));
  };

  return (
    <ChatContext.Provider value={{ chat, setChat, addMessage }}>
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
