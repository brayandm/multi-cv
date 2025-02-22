import { HeroUIProvider as Provider } from "@heroui/system";

export function HeroUIProvider({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
