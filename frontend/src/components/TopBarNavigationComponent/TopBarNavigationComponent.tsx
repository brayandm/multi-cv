"use client";

import { useRouter } from "next/navigation";
import {
  TopBarNavigation,
  TopBarNavigationContainer,
} from "./TopBarNavigationComponent.styles";
import { logoutApi } from "@/lib/backendService";

interface ITopBarNavigationProps {
  passwordLink?: boolean;
  homeLink?: boolean;
  logoutLink?: boolean;
}

export default function TopBarNavigationComponent({
  passwordLink,
  homeLink,
  logoutLink,
}: ITopBarNavigationProps) {
  const router = useRouter();

  const logout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const logoutResponse = await logoutApi();

      if (logoutResponse.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TopBarNavigation>
      <TopBarNavigationContainer>
        {homeLink && (
          <span className="text-xs text-gray-600">
            <button
              onClick={() => {
                router.push("/home");
              }}
              className="text-primary underline"
            >
              Home
            </button>
          </span>
        )}
        {passwordLink && (
          <span className="text-xs text-gray-600">
            <button
              onClick={() => {
                router.push("/password");
              }}
              className="text-primary underline"
            >
              Change Password
            </button>
          </span>
        )}
        {logoutLink && (
          <span className="text-xs text-gray-600">
            <button onClick={logout} className="text-primary underline">
              Logout
            </button>
          </span>
        )}
      </TopBarNavigationContainer>
    </TopBarNavigation>
  );
}
