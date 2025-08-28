import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/src/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FLIX - See the world through your LENS",
  description: "Next-gen video social media platform with personalized feeds and creator monetization.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
