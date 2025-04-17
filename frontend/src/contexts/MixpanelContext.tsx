"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";
import mixpanel from "mixpanel-browser";
import { useUserStatus } from "./UserStatusContext";

const MIXPANEL_TOKEN: string | undefined =
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

interface MixpanelEventProps {
  [key: string]: string | number | boolean | null | undefined;
}

interface MixpanelContextType {
  track: (eventName: string, props?: MixpanelEventProps) => void;
  isReady: boolean;
}

const MixpanelContext = createContext<MixpanelContextType | undefined>(
  undefined
);

interface MixpanelProviderProps {
  children: ReactNode;
}

export const MixpanelProvider = ({ children }: MixpanelProviderProps) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const { userStatus } = useUserStatus();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const consent = localStorage.getItem("cookie_consent");

    if (!consent || consent === "denied") {
      console.warn("Mixpanel tracking is disabled due to cookie consent");
      return;
    }

    if (!MIXPANEL_TOKEN) {
      console.warn("Mixpanel token is not defined");
      return;
    }

    const config = {
      debug: process.env.NODE_ENV !== "production",
      persistence: "localStorage",
      autocapture: {
        pageview: "full-url",
        click: false,
        input: false,
        scroll: false,
        submit: false,
        capture_text_content: false,
      },
      record_sessions_percent: 100,
      record_mask_text_selector: "",
      record_block_selector: "",
      record_collect_fonts: true,
      record_min_ms: 8000,
    };

    // eslint-disable-next-line
    mixpanel.init(MIXPANEL_TOKEN, config as any);

    const isIframe = window.self !== window.top;

    mixpanel.register({
      is_chrome_extension: isIframe,
    });

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || !userStatus?.authenticated || !userStatus.email) return;

    mixpanel.identify(userStatus.email);

    mixpanel.people.set({
      $email: userStatus.email,
      $first_name: userStatus.first_name,
      $last_name: userStatus.last_name,
    });
  }, [isReady, userStatus]);

  const track = useCallback(
    (eventName: string, props?: MixpanelEventProps): void => {
      if (!isReady) return;
      mixpanel.track(eventName, props ?? {});
    },
    [isReady]
  );

  const contextValue = useMemo<MixpanelContextType>(
    () => ({ track, isReady }),
    [track, isReady]
  );

  return (
    <MixpanelContext.Provider value={contextValue}>
      {children}
    </MixpanelContext.Provider>
  );
};

export const useMixpanel = (): MixpanelContextType => {
  const context = useContext(MixpanelContext);
  if (!context) {
    throw new Error("useMixpanel must be used within a MixpanelProvider");
  }
  return context;
};
