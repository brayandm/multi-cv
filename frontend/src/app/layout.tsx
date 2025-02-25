import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeroUIProvider } from "@/providers/HeroUIProvider";
import { AppContainer } from "./main.styles";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HeroUIProvider>
          <AppContainer>{children}</AppContainer>
        </HeroUIProvider>
      </body>
    </html>
  );
}
