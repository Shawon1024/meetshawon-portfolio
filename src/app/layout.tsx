import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimatedBackground from "./components/background/AnimatedBackground";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { keyframes } from "framer-motion";
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

  title: "Shawon",
  description:"Cybersecurity portfolio, projects, technical writing, and professional development.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
<body>
  <Navbar />
  <AnimatedBackground />
    <div className="pt-20">
      {children}
    </div>
  <Footer />
</body>
    </html>
  );
}
