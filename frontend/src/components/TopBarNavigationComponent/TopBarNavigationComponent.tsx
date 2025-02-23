"use client";

import { useRouter } from "next/navigation";
import {
  TopBarNavigation,
  TopBarNavigationContainer,
} from "./TopBarNavigationComponent.styles";

interface ITopBarNavigationProps {
  passwordLink?: boolean;
  homeLink?: boolean;
}

export default function TopBarNavigationComponent({
  passwordLink,
  homeLink,
}: ITopBarNavigationProps) {
  const router = useRouter();

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
      </TopBarNavigationContainer>
    </TopBarNavigation>
  );
}
