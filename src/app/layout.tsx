import type { Metadata, Viewport } from "next";
import { Special_Elite, Lato, Caveat } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";

const specialElite = Special_Elite({
  variable: "--font-typewriter",
  weight: "400",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-body",
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Napi Meal Planning",
  description: "Nadim & Rupi's meal planning",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${specialElite.variable} ${lato.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Nav />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 pb-8">
          {children}
        </main>
      </body>
    </html>
  );
}
