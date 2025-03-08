import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";

const geistSans = Lora({
  // variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic']
});

export const metadata: Metadata = {
  title: "Polaris",
  description: "Student Management for the Achieve Program",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      style={geistSans.style}
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
