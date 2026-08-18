import type {
  Metadata,
} from "next";
import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimatedBackground from "./components/background/AnimatedBackground";
import FloatingNotifications from "./components/account/FloatingNotifications";

import "./globals.css";
import "highlight.js/styles/github-dark.css";

const geistSans =
  Geist({
    variable:
      "--font-geist-sans",
    subsets: [
      "latin",
    ],
  });

const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",
    subsets: [
      "latin",
    ],
  });

const siteUrl =
  process.env
    .NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000";

export const metadata: Metadata =
  {
    metadataBase:
      new URL(
        siteUrl,
      ),

    // --------------------------------------------------
    // BASIC SEO
    // --------------------------------------------------

    title: {
      default:
        "Meet Shawon | Cybersecurity & Software Portfolio",

      template:
        "%s — Meet Shawon",
    },

    description:
      "Personal portfolio of Shawon, featuring cybersecurity, ethical hacking, software development, projects, certifications, technical articles, and professional experience.",

    applicationName:
      "Meet Shawon",

    authors: [
      {
        name:
          "Shawon",
        url:
          siteUrl,
      },
    ],

    creator:
      "Shawon",

    publisher:
      "Meet Shawon",

    // --------------------------------------------------
    // CANONICAL
    // --------------------------------------------------

    alternates: {
      canonical:
        "/",
    },

    // --------------------------------------------------
    // SEARCH ENGINES
    // --------------------------------------------------

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview":
          "large",
        "max-snippet":
          -1,
        "max-video-preview":
          -1,
      },
    },

    // --------------------------------------------------
    // OPEN GRAPH
    // --------------------------------------------------

    openGraph: {
      type:
        "website",

      locale:
        "en_GB",

      url:
        siteUrl,

      siteName:
        "Meet Shawon",

      title:
        "Meet Shawon | Cybersecurity & Software Portfolio",

      description:
        "Cybersecurity, ethical hacking, software development, technical projects, certifications, articles, and professional experience.",

      images: [
        {
          url:
            "/opengraph-image.png",

          width:
            1200,

          height:
            630,

          alt:
            "Meet Shawon — Cybersecurity & Software Portfolio",
        },
      ],
    },

    // --------------------------------------------------
    // TWITTER / X
    // --------------------------------------------------

    twitter: {
      card:
        "summary_large_image",

      title:
        "Meet Shawon | Cybersecurity & Software Portfolio",

      description:
        "Cybersecurity, ethical hacking, software development, technical projects, certifications, articles, and professional experience.",

      images: [
        "/opengraph-image.png",
      ],
    },

    // --------------------------------------------------
    // ICONS
    // --------------------------------------------------

    icons: {
      icon: [
        {
          url:
            "/favicon.ico",
        },
      ],

      apple: [
        {
          url:
            "/apple-icon.png",
        },
      ],
    },

    // --------------------------------------------------
    // CATEGORY
    // --------------------------------------------------

    category:
      "technology",
  };

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
          <html
            lang="en"
            data-scroll-behavior="smooth"
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