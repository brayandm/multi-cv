"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useCallback,
} from "react";

interface RouterCustomContextType {
  router: {
    push: (url: string) => void;
  };
  unlock: () => void;
  lock: () => void;
  setOnAttemptedNavigation: (fn: ((url: string) => void) | null) => void;
}

const RouterCustomContext = createContext<RouterCustomContextType | undefined>(
  undefined
);

export const RouterCustomProvider = ({ children }: { children: ReactNode }) => {
  const nextRouter = useRouter();
  const [isLocked, setIsLocked] = useState(false);
  const onAttemptedNavigationRef = useRef<((url: string) => void) | null>(null);
  const pendingUrlRef = useRef<string | null>(null);

  const push = useCallback(
    (url: string) => {
      if (isLocked) {
        pendingUrlRef.current = url;
        onAttemptedNavigationRef.current?.(url);
      } else {
        nextRouter.push(url);
      }
    },
    [isLocked, nextRouter]
  );

  const unlock = () => {
    setIsLocked(false);
    if (pendingUrlRef.current) {
      nextRouter.push(pendingUrlRef.current);
      pendingUrlRef.current = null;
    }
  };

  const lock = () => {
    setIsLocked(true);
  };

  const setOnAttemptedNavigation = (fn: ((url: string) => void) | null) => {
    onAttemptedNavigationRef.current = fn;
  };

  return (
    <RouterCustomContext.Provider
      value={{
        router: { push },
        unlock,
        lock,
        setOnAttemptedNavigation,
      }}
    >
      {children}
    </RouterCustomContext.Provider>
  );
};

export const useRouterCustom = () => {
  const context = useContext(RouterCustomContext);
  if (!context) {
    throw new Error(
      "useRouterCustom must be used within a RouterCustomProvider"
    );
  }
  return context;
};
