import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MarginTopContainer } from "./main.styles";
import { getLocale } from "next-intl/server";
import { ClientLayout } from "./ClientLayout";
import Providers from "./providers";
import { cookies } from "next/headers";

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
  const theme = (await cookies()).get("theme")?.value || "light";

  return (
    <html lang={locale} className={`flex h-screen ${theme}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex-grow `}
      >
        <Providers>
          <ClientLayout>
            <MarginTopContainer>{children}</MarginTopContainer>
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
