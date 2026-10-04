import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import JarvisChat from "@/components/JarvisChat";

export const metadata: Metadata = {
  title: "SHAHEEN · Jarvis AI",
  description: "Jarvis AI Property Automation System — SHAHEEN",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#0a0a0a", minHeight: "100vh" }}>
        <StoreProvider>
          {/* Sidebar fixed left */}
          <Sidebar />

          {/* Main content area offset by sidebar width */}
          <div style={{ marginLeft: "230px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
              {children}
            </main>
          </div>
          <JarvisChat />
        </StoreProvider>
      </body>
    </html>
  );
}
