"use client";

import { TopBarNavigation } from "@/app/main.styles";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";
import { useRouter } from "next/navigation";

interface ITopBarNavigationProps {
  passwordLink?: boolean;
  homeLink?: boolean;
}

export default function TopBarNavigationComponent({
  passwordLink,
  homeLink,
}: ITopBarNavigationProps) {
  const router = useRouter();

  const { isLoading } = useIsAuthenticated();

  if (isLoading) {
    return null;
  }

  return (
    <TopBarNavigation>
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
    </TopBarNavigation>
  );
}
