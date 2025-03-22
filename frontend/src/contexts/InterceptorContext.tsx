"use client";

import { createContext, useContext, useRef, ReactNode } from "react";

type ActionName = string;
type Callback = () => void;

interface InterceptorContextType {
  lock: (action: ActionName) => void;
  unlock: (action: ActionName) => void;
  run: (actions: Record<ActionName, Callback>) => void;
  setCallback: (callbacks: Record<ActionName, Callback | null>) => void;
}

const InterceptorContext = createContext<InterceptorContextType | undefined>(
  undefined
);

export const InterceptorProvider = ({ children }: { children: ReactNode }) => {
  const lockedActionsRef = useRef<Set<ActionName>>(new Set());
  const pendingCallbacksRef = useRef<Map<ActionName, Callback>>(new Map());
  const actionCallbacksRef = useRef<Map<ActionName, Callback | null>>(
    new Map()
  );

  const lock = (action: ActionName) => {
    lockedActionsRef.current.add(action);
  };

  const unlock = (action: ActionName) => {
    lockedActionsRef.current.delete(action);
    const pending = pendingCallbacksRef.current.get(action);
    if (pending) {
      pending();
      pendingCallbacksRef.current.delete(action);
    }
  };

  const run = (actions: Record<ActionName, Callback>) => {
    for (const [action, fn] of Object.entries(actions)) {
      if (lockedActionsRef.current.has(action)) {
        pendingCallbacksRef.current.set(action, fn);
        const onAttempt = actionCallbacksRef.current.get(action);
        if (onAttempt) onAttempt();
      } else {
        fn();
      }
    }
  };

  const setCallback = (callbacks: Record<ActionName, Callback | null>) => {
    for (const [action, fn] of Object.entries(callbacks)) {
      actionCallbacksRef.current.set(action, fn);
    }
  };

  return (
    <InterceptorContext.Provider
      value={{
        lock,
        unlock,
        run,
        setCallback,
      }}
    >
      {children}
    </InterceptorContext.Provider>
  );
};

export const useInterceptor = () => {
  const context = useContext(InterceptorContext);
  if (!context) {
    throw new Error(
      "useInterceptor must be used within an InterceptorProvider"
    );
  }
  return context;
};
