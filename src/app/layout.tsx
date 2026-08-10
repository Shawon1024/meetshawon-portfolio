import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimatedBackground from "./components/background/AnimatedBackground";
import FloatingNotifications from "./components/account/FloatingNotifications";
import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";
import "highlight.js/styles/github-dark.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000",
  ),

  title: {
    default:
      "Meet Shawon | Cybersecurity & Software Portfolio",
    template:
      "%s — Meet Shawon",
  },

  description:
    "Personal portfolio of Shawon, featuring cybersecurity, ethical hacking, software development, projects, certifications, technical articles, and professional experience.",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AnimatedBackground />

        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <FloatingNotifications />
          <div className="flex-1">
            {children}
          </div>

          <Footer />
        </div>
      </body>
    </html>
  );
}