import type { Metadata } from "next";
import { Playfair_Display, Lora, Fraunces, Inter, DM_Mono } from "next/font/google";
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

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Journy — a guidebook, written for one.",
  description:
    "A pocket guidebook, issued on demand, for travelers who prefer a point of view. Twelve statements. One of sixteen notations.",
  keywords: [
    "travel",
    "personality",
    "trip planning",
    "travel compatibility",
    "travel quiz",
  ],
  openGraph: {
    title: "Journy — a guidebook, written for one.",
    description: "Twelve statements. A notation. A guidebook.",
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
      className={`${playfairDisplay.variable} ${lora.variable} ${fraunces.variable} ${inter.variable} ${dmMono.variable} min-h-dvh`}
    >
      <body className="flex min-h-dvh flex-col antialiased">{children}</body>
    </html>
  );
}
