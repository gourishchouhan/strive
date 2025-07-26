import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from '@/components/Sidebar'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Strive - Personal Growth & Challenge Tracker",
  description: "Track your daily schedules, set self-improvement challenges, and visualize your achievements with Strive.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-auto lg:ml-0">
            <div className="p-4 lg:p-8 pt-16 lg:pt-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
