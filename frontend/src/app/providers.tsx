import { HeroUIProvider } from "@/providers/HeroUIProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ToastProvider } from "@/providers/ToastProvider";
import { UserStatusProvider } from "@/contexts/UserStatusContext";
import { RouterCustomProvider } from "@/contexts/RouterCustomContext";

export default async function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <HeroUIProvider>
      <ToastProvider />
      <NextIntlClientProvider messages={messages}>
        <LocaleProvider>
          <RouterCustomProvider>
            <UserStatusProvider>
              <ProfileProvider>{children}</ProfileProvider>
            </UserStatusProvider>
          </RouterCustomProvider>
        </LocaleProvider>
      </NextIntlClientProvider>
    </HeroUIProvider>
  );
}
