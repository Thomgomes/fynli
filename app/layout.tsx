import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ReactNode } from "react";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Fynli",
  description: "Organize seus gastos compartilhados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${sora.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
