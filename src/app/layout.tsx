import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

import { ThemeProvider } from "@/context/ThemeContext";
import { SnippetProvider } from "@/context/SnippetContext";

import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SnippetLib - Your Personal Code Snippet Library",
  description:
    "Organize, store, and access your code snippets from anywhere. Your personal digital library for efficient and streamlined development.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <AuthProvider>
          <SnippetProvider>
            <ThemeProvider>
              <Navbar />
              {children}
              <Toaster />
            </ThemeProvider>
          </SnippetProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
