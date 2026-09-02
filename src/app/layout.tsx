import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import FloatingNotifications from "./components/account/FloatingNotifications";
import AnimatedBackground from "./components/background/AnimatedBackground";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SiteNotice from "./components/SiteNotice";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Meet Shawon | Cybersecurity & Software Portfolio",
    template: "%s — Meet Shawon",
  },
  description:
    "Personal portfolio of Md Samsudduha Shawon, featuring cybersecurity, ethical hacking, software development, projects, certifications, technical articles, and professional experience.",
  applicationName: "Meet Shawon",
  authors: [{ name: "Md Samsudduha Shawon", url: siteUrl }],
  creator: "Md Samsudduha Shawon",
  publisher: "Meet Shawon",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "Meet Shawon",
    title: "Meet Shawon | Cybersecurity & Software Portfolio",
    description:
      "Cybersecurity, ethical hacking, software development, technical projects, certifications, articles, and professional experience.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Meet Shawon — Cybersecurity & Software Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet Shawon | Cybersecurity & Software Portfolio",
    description:
      "Cybersecurity, ethical hacking, software development, technical projects, certifications, articles, and professional experience.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  category: "technology",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <AnimatedBackground />

        <div className="relative z-10 flex min-h-screen flex-col">
          <div className="portfolio-global-chrome">
            <Navbar />
            <SiteNotice />
            <FloatingNotifications />
          </div>

          <div className="flex-1">{children}</div>

          <div className="portfolio-global-chrome">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
