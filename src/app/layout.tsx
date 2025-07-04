import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "تطبيق الشرطة",
  description: "نظام إدارة سجلات المجرمين",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppLayout>
          {children}
        </AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
