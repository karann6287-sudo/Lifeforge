import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Main } from "@/components/Main";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LIFEFORGE — Your real-life actions forge your character",
    template: "%s | LIFEFORGE",
  },
  description: "Turn real-life habits into RPG progression. Complete quests, earn XP, level up attributes, and build your character.",
  keywords: ["habit tracker", "RPG", "gamification", "productivity", "self-improvement"],
  authors: [{ name: "LIFEFORGE Team" }],
  creator: "LIFEFORGE",
  publisher: "LIFEFORGE",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lifeforge.app",
    siteName: "LIFEFORGE",
    title: "LIFEFORGE — Your real-life actions forge your character",
    description: "Turn real-life habits into RPG progression. Complete quests, earn XP, level up attributes, and build your character.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LIFEFORGE - Gamify your life",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LIFEFORGE — Your real-life actions forge your character",
    description: "Turn real-life habits into RPG progression.",
    images: ["/og-image.png"],
    creator: "@lifeforge",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground">
          Skip to main content
        </a>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </body>
    </html>
  );
}