import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "cholloweb.es | Ofertas gaming y tecnología",
  description:
    "Ofertas de videojuegos, consolas, figuras y reacondicionados con enlaces de afiliado de Amazon.",
  metadataBase: new URL("https://cholloweb.es"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png",    type: "image/png", sizes: "512x512" },
    ],
    apple: { url: "/logo.png", sizes: "180x180" },
  },
  openGraph: {
    type:        "website",
    siteName:    "cholloweb.es",
    locale:      "es_ES",
    images: [
      {
        url:    "/logo.png",
        width:  512,
        height: 512,
        alt:    "cholloweb.es — Ofertas gaming y tecnología",
      },
    ],
  },
  twitter: {
    card:  "summary",
    title: "cholloweb.es | Ofertas gaming y tecnología",
    description:
      "Ofertas de videojuegos, consolas y reacondicionados con enlaces de afiliado de Amazon.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
