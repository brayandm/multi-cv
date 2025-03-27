import { HeroUIProvider } from "@/providers/HeroUIProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ToastProvider } from "@/providers/ToastProvider";
import { UserStatusProvider } from "@/contexts/UserStatusContext";
import { InterceptorProvider } from "@/contexts/InterceptorContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { CvProvider } from "@/contexts/CvContext";

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
          <InterceptorProvider>
            <ChatProvider>
              <UserStatusProvider>
                <ProfileProvider>
                  <CvProvider>{children}</CvProvider>
                </ProfileProvider>
              </UserStatusProvider>
            </ChatProvider>
          </InterceptorProvider>
        </LocaleProvider>
      </NextIntlClientProvider>
    </HeroUIProvider>
  );
}
