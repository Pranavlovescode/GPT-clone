import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChatProvider } from '@/context/ChatContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ChatGPT Clone",
  description: "A full featured ChatGPT clone built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}
