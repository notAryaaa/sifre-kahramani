import type { Metadata, Viewport } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Şifre Kahramanı — Şifreni güçlendir, dijital dünyanı koru!",
  description:
    "Şifreni test et, gücünü anında gör, oyunla öğren. Şifre Kahramanı ile dijital güvenlik kahramanı ol.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#edf1fb" },
    { media: "(prefers-color-scheme: dark)", color: "#090d1f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
