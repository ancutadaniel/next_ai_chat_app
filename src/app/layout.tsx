import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // We use the '@/' alias to import our component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Chat App",
  description: "A modern AI chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* We use a flex container to create the sidebar/main content layout */}
        <div className="flex h-screen bg-gray-900 overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-4">
            {children} {/* 'children' will be our main page content */}
          </main>
        </div>
      </body>
    </html>
  );
}
