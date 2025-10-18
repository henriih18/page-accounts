import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "@/components/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StreamHub - Cuentas de Streaming Premium",
  description: "Accede a Netflix, Disney+, HBO Max y más plataformas de streaming a precios increíbles. Calidad garantizada y entrega instantánea.",
  keywords: ["streaming", "Netflix", "Disney+", "HBO Max", "cuentas premium", "streaming barato"],
  authors: [{ name: "StreamHub Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "StreamHub - Cuentas de Streaming Premium",
    description: "Accede a las mejores plataformas de streaming a precios increíbles",
    url: "https://streamhub.com",
    siteName: "StreamHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreamHub - Cuentas de Streaming Premium",
    description: "Accede a las mejores plataformas de streaming a precios increíbles",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
