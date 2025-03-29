"use client";

import { userStatusApi } from "@/lib/backendService";
import { UserStatusResponse } from "@/lib/types";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface UserStatusContextType {
  userStatus: UserStatusResponse;
  refreshUserStatus: () => void;
}

const UserStatusContext = createContext<UserStatusContextType | undefined>(
  undefined
);

export const UserStatusProvider = ({ children }: { children: ReactNode }) => {
  const [userStatus, setUserStatus] = useState<UserStatusResponse>({
    authenticated: false,
  });

  useEffect(() => {
    userStatusApi().then((response) => {
      setUserStatus(response.data);
    });
  }, []);

  const refreshUserStatus = () => {
    userStatusApi().then((response) => {
      setUserStatus(response.data);
    });
  };

  return (
    <UserStatusContext.Provider value={{ userStatus, refreshUserStatus }}>
      {children}
    </UserStatusContext.Provider>
  );
};

export const useUserStatus = () => {
  const context = useContext(UserStatusContext);
  if (!context) {
    throw new Error("useUserStatus must be used within a UserStatusProvider");
  }
  return context;
};
