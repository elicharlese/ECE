import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

export const metadata: Metadata = {
  title: "ECE | M&A Trading Card Platform",
  description: "Revolutionize corporate takeovers with strategic trading cards. Master M&A battles in the world's first M&A-focused digital platform.",
  keywords: "M&A, mergers and acquisitions, trading cards, digital cards, corporate strategy, ECE, marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          defaultTheme="dark"
          storageKey="ece-ui-theme"
        >
          <div id="modal-root"></div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
