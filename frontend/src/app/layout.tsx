import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import UserBar from "@/components/UserBar";
import ParticleCanvas from "@/components/ParticleCanvas";
import SearchOverlay from "@/components/SearchOverlay";
import ScrollObserver from "@/components/ScrollObserver";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Crafter's Guild | Forged in Darkness",
  description: "A forum and marketplace for the finest artisans and craftsmen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ScrollObserver />
          <div className="layout">
            <Sidebar />
            <UserBar />
            <ParticleCanvas />
            <SearchOverlay />
            <main className="main">
              <div className="main__content">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
