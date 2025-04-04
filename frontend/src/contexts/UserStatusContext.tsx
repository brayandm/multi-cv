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
  isLoading: boolean;
}

const UserStatusContext = createContext<UserStatusContextType | undefined>(
  undefined
);

export const UserStatusProvider = ({ children }: { children: ReactNode }) => {
  const [userStatus, setUserStatus] = useState<UserStatusResponse>({
    authenticated: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    userStatusApi().then((response) => {
      setUserStatus(response.data);
      setIsLoading(false);
    });
  }, []);

  const refreshUserStatus = async () => {
    setIsLoading(true);
    await userStatusApi().then((response) => {
      setUserStatus(response.data);
      setIsLoading(false);
    });
  };

  return (
    <UserStatusContext.Provider
      value={{ userStatus, refreshUserStatus, isLoading }}
    >
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
