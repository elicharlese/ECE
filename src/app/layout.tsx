import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "ECE Trading Cards | Digital Trading Card Platform",
  description: "Trade, collect, and discover unique digital trading cards. Build your deck, join the community, and experience the future of trading cards.",
  keywords: "trading cards, digital cards, NFT, collectibles, ECE, marketplace",
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
