import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeroUIProvider } from "@/providers/HeroUIProvider";
import { MarginTopContainer } from "./main.styles";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { ClientLayout } from "./ClientLayout";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ToastProvider } from "@/providers/ToastProvider";
import { UserStatusProvider } from "@/contexts/UserStatusContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MultiCV",
  description: "Create and manage multiple CVs",
  openGraph: {
    type: "website",
    url: "https://multicv.space",
    title: "MultiCV",
    siteName: "MultiCV",
    description: "Create and manage multiple CVs",
    images: [
      {
        url: "https://multicv.space/og-image.png",
        width: 500,
        height: 500,
        alt: "MultiCV",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MultiCV",
    description: "Create and manage multiple CVs",
    images: ["https://multicv.space/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  const messages = await getMessages();

  return (
    <html lang={locale} className="flex h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex-grow `}
      >
        <HeroUIProvider>
          <ToastProvider />
          <NextIntlClientProvider messages={messages}>
            <LocaleProvider>
              <UserStatusProvider>
                <ProfileProvider>
                  <ClientLayout>
                    <MarginTopContainer>{children}</MarginTopContainer>
                  </ClientLayout>
                </ProfileProvider>
              </UserStatusProvider>
            </LocaleProvider>
          </NextIntlClientProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
