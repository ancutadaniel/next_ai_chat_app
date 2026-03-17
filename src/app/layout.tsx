import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SidebarProvider from "@/components/SidebarProvider";
import { Toaster } from "sonner";
import MobileHeader from "@/components/MobileHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "W3B AI Chat",
  description: "W3B AI Chat - A modern AI chat experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col">
              <MobileHeader />
              <main className="flex-1 overflow-hidden bg-black">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--studio-sidebar)',
              border: '1px solid var(--studio-border)',
              color: 'var(--studio-text-primary)',
            },
          }}
        />
      </body>
    </html>
  );
}
