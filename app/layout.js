import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from '@/components/AuthProvider'
import ConditionalLayout from '@/components/ConditionalLayout'

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
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
