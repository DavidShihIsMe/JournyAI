import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Journy — Travel like yourself, not like your feed",
  description:
    "Discover your traveler personality, find your perfect travel companions, and get itineraries built for who you actually are.",
  keywords: [
    "travel",
    "personality",
    "trip planning",
    "travel compatibility",
    "travel quiz",
  ],
  openGraph: {
    title: "Journy — Travel like yourself",
    description: "Discover your traveler personality type.",
    type: "website",
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
      className={`${playfairDisplay.variable} ${lora.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
