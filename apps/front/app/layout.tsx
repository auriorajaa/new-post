import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import DesktopNavbar from "@/components/desktopNavbar";
import Providers from "./providers";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://the-post-journal.vercel.app";
const SITE_NAME = "The Journal";
const SITE_DESCRIPTION =
  "The Journal is a publication for ideas, stories, and perspectives on technology, creativity, and culture.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Ideas worth reading`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Aurio Rajaa" }],
  creator: "Aurio Rajaa",
  keywords: [
    "blog",
    "articles",
    "technology",
    "creativity",
    "culture",
    "writing",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Ideas worth reading`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Ideas worth reading`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        outfit.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <DesktopNavbar>
            <Navbar />
          </DesktopNavbar>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
