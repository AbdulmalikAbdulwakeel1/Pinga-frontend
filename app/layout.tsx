import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import { Toaster } from "@/components/ui/sonner";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pinga.ng"),
  title: "Pinga — AI Social Sales Agent for Nigerian Businesses",
  description:
    "Pinga auto-replies to Instagram, Facebook, and WhatsApp DMs, manages product catalogs, captures leads, and tracks orders for Nigerian small businesses.",
  keywords: [
    "AI sales agent",
    "social commerce",
    "Nigerian business",
    "Instagram DM",
    "WhatsApp business",
    "Facebook sales",
    "lead management",
  ],
  icons: {
    icon: "/images/Favicon.jpg",
    apple: "/images/Favicon.jpg",
  },
  authors: [{ name: "Pinga Team" }],
  creator: "Pinga",
  publisher: "Pinga",
  openGraph: {
    title: "Pinga — AI Social Sales Agent for Nigerian Businesses",
    description:
      "Auto-reply to DMs, manage products, capture leads, and track orders across Instagram, Facebook & WhatsApp.",
    url: "https://pinga.ng",
    siteName: "Pinga",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pinga — AI Social Sales Agent",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pinga — AI Social Sales Agent for Nigerian Businesses",
    description:
      "Auto-reply to DMs, manage products, capture leads, and track orders across Instagram, Facebook & WhatsApp.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <Toaster position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
