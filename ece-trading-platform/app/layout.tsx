import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../src/lib/theme-context";
import { AuthProvider } from "../src/lib/auth-context";
import { WalletProvider } from "../src/lib/wallet-context";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ECE Trading Platform",
  description: "Revolutionary app trading platform with AI-powered discovery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} font-quicksand antialiased`}
      >
        <AuthProvider>
          <WalletProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </WalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
